const { User } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNurseries = async (req, res) => {
  try {
    const nurseries = await User.findAll({
      where: { role: "nursery" },
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(nurseries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve nurseries", error: error.message });
  }
};

exports.getMothers = async (req, res) => {
  try {
    const nurseries = await User.findAll({
      where: { role: "mother" },
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(nurseries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve mother", error: error.message });
  }
};
