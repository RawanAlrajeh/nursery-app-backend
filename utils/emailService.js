const nodemailer = require('nodemailer');

const sendInvitationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Invitation',
    html: `<p>You have been invited to join our platform. Please click the link below to set your password:</p>
           <a href="${process.env.FRONTEND_URL}/set-password?token=${token}">Set Password</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendInvitationEmail };
