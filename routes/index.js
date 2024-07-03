const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const babysitterRoutes = require("./babysitterRoutes");
const classRoutes = require("./classRoutes");
const nurseryRoutes = require("./nurseryRoutes");
const motherRoutes = require("./motherRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// router.use("/babysitters", babysitterRoutes);
// router.use("/classes", classRoutes);
router.use("/nurseries", nurseryRoutes);
router.use("/mothers", motherRoutes);

module.exports = router;
