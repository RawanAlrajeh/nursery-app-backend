const jwt = require('jsonwebtoken');
const { User, sequelize } = require('../models'); // Ensure sequelize is imported
const { sendInvitationEmail } = require('../utils/emailService'); // Correct import
const bcrypt = require("bcryptjs");

exports.adminRegister = async (req, res) => {
  const { name, email, role } = req.body;

  if (!["mother", "nursery"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create user without password within a transaction
    const user = await User.create({
      name,
      email,
      role,
    }, { transaction });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send invitation email
    await sendInvitationEmail(user.email, token);

    // Commit transaction only if email is sent successfully
    await transaction.commit();

    res.status(201).json({ message: "User registered successfully. Invitation email sent." });
  } catch (error) {
    // Rollback transaction if any error occurs
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

// Set password for new user
exports.setPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user not found' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password set successfully' });
  } catch (error) {
    console.error('Error setting password:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to set password', error: error.message });
  }
};