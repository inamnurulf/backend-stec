const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const saltRounds = parseInt(process.env.SALTROUNDS, 10);
const jwt = require("jsonwebtoken");
const generateOTP = require("../helper/generateOTP")
const db = require("../helper/db")

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});


exports.signUp = async (req, res, next) => {
  try {
    const newAccount = req.body;

    if (!newAccount || Object.keys(newAccount).length === 0) {
      return res.status(400).json({ error: 'Bad request. Request body is empty.' });
    }

    const existingAccount = await db.account.findFirst({
      where: { OR: [{ email: newAccount.email }] },
    });

    if (existingAccount && existingAccount.isVerified) {
      const responseAccount = {
        error: 'Account with the same email already exists and has been verified',
        needVerify: false,
      };

      return res.status(400).json(responseAccount);
    }

    if (existingAccount && !existingAccount.isVerified) {
      const responseAccount = {
        error: 'Account with the same email already exists and needs verification',
        needVerify: true,
      };

      return res.status(200).json(responseAccount);
    }

    const OTPverif = generateOTP();
    const mailOptions = {
      from: `Stechoq Verification <${process.env.MAIL_USERNAME}>`,
      to: newAccount.email,
      subject: 'Stechoq Account Verification',
      html: `
        <main>
          <style>
          </style>
          <div>
           <h2>Verify Your Account</h2>
            <div>This is your OTP ${OTPverif}</div>
          </div>
        </main>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error occurred while sending email', code: err.code });
    }

    const hashedPassword = await bcrypt.hash(newAccount.password, 10);

    const createdAccount = await db.account.create({
      data: {
        ...newAccount,
        password: hashedPassword,
        otp : OTPverif
      },
    });

    res.status(201).json({ message: 'User created successfully', createdAccount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Login successful"});
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
