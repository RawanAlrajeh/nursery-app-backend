const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { tokenBlacklist } = require("../middlewares/authMiddleware");

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
      return res.status(400).json({ message: "Email and password are required" });
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

    const otpToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const verificationCode = generateVerificationCode();
    verificationCodes[user.id] = verificationCode;

    console.log("Login successful, role:", user.role); // Debugging line
    res.status(200).json({ otpToken, verificationCode, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;

  const storedCode = verificationCodes[userId];

  if (storedCode && storedCode === code) {
    delete verificationCodes[userId];

    const newToken = jwt.sign(
      { userId: req.user.userId, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Verification successful", newToken });
  }

  return res.status(400).json({ message: "Invalid verification code" });
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    tokenBlacklist.push(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

exports.setPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging line

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Error setting password:", error); // Log the error
    res.status(500).json({ message: "Failed to set password", error: error.message });
  }
};



exports.adminRegister = async (req, res) => {
  const { name, email, role } = req.body;

  if (!["mother", "nursery"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  const transaction = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      role,
    }, { transaction });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await sendInvitationEmail(user.email, token);
    await transaction.commit();

    res.status(201).json({ message: "User registered successfully. Invitation email sent." });
  } catch (error) {
    await transaction.rollback();

    if (error.name === "SequelizeUniqueConstraintError") {
      const uniqueError = error.errors.find((err) => err.type === "unique violation");
      res.status(400).json({
        message: "User registration failed",
        error: {
          code: error.parent.code,
          message: uniqueError ? uniqueError.message : "Unique constraint violation",
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