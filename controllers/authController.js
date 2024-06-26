const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { tokenBlacklist } = require('../middlewares/authMiddleware'); // Import the blacklist

// In-memory store for verification codes (in a real application, use a database)

const verificationCodes = {};

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const uniqueError = error.errors.find(
        (err) => err.type === "unique violation"
      );
      res.status(400).json({
        message: "User registration failed",
        error: {
          code: error.parent.code,
          message: uniqueError
            ? uniqueError.message
            : "Unique constraint violation",
        },
      });
    } else {
      res.status(500).json({
        message: "User registration failed",
        error: {
          code: error.parent?.code || "INTERNAL_SERVER_ERROR",
          message: error.message,
        },
      });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Internal server error" });
    }

    // Generate OTP token for verification
    const otpToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate and store the verification code
    const verificationCode = generateVerificationCode();
    verificationCodes[user.id] = verificationCode;

    res.status(200).json({ otpToken, verificationCode });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Verify OTP code and return a new token upon success
exports.verifyCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId; // Ensure this is correctly set from the token

  const storedCode = verificationCodes[userId];

  if (storedCode && storedCode === code) {
    delete verificationCodes[userId]; // Clear the code after successful verification

    // Generate a new token after successful verification
    const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ message: "Verification successful", newToken });
  }

  return res.status(400).json({ message: "Invalid verification code" });
};

exports.logout = async (req, res) => {
  try {
    // Add the token to the blacklist
    const token = req.headers.authorization.split(" ")[1];
    tokenBlacklist.push(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};
