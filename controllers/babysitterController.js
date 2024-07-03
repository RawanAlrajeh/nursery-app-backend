const { Babysitter } = require("../models");
const { sendInvitationEmail } = require("../services/emailService");
const jwt = require("jsonwebtoken");

exports.createBabysitter = async (req, res) => {
  const { nurseryId } = req.params;
  const { full_name, age, mobile, idNumber, email } = req.body;

  try {
    const existingMobile = await Babysitter.findOne({ where: { mobile } });
    if (existingMobile)
      return res.status(400).json({ message: "Mobile number already in use" });

    const existingIdNumber = await Babysitter.findOne({ where: { idNumber } });
    if (existingIdNumber)
      return res.status(400).json({ message: "ID number already in use" });

    const existingEmail = await Babysitter.findOne({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ message: "Email already in use" });

    const babysitter = await Babysitter.create({
      full_name,
      age,
      mobile,
      idNumber,
      email,
      nurseryId,
    });

    const token = jwt.sign(
      { babysitterId: babysitter.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    await sendInvitationEmail(babysitter.email, token);

    res.status(201).json(babysitter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
