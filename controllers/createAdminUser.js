// createAdminUser.js
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const createAdminUser = async () => {
  const name = "Admin";
  const email = "super_admin@nursery.com";
  const password = "P@ssword"; // Change to a strong password
  const role = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdminUser().then(() => {
  process.exit();
});
