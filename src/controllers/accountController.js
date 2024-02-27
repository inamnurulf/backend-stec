const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const saltRounds = parseInt(process.env.SALTROUNDS, 10);
const generateOTP = require("../helper/generateOTP");
const generateToken = require("../helper/generateToken");
const db = require("../helper/db");

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
      return res
        .status(400)
        .json({ error: "Bad request. Request body is empty." });
    }

    const existingAccount = await db.account.findFirst({
      where: { OR: [{ email: newAccount.email }] },
    });

    if (existingAccount && existingAccount.isVerified) {
      const responseAccount = {
        error:
          "Account with the same email already exists and has been verified",
        needVerify: false,
      };

      return res.status(400).json(responseAccount);
    }

    if (existingAccount && !existingAccount.isVerified) {
      const responseAccount = {
        error:
          "Account with the same email already exists and needs verification",
        needVerify: true,
      };

      return res.status(200).json(responseAccount);
    }

    const OTPverif = generateOTP();
    const mailOptions = {
      from: `Stechoq Verification <${process.env.MAIL_USERNAME}>`,
      to: newAccount.email,
      subject: "Stechoq Account Verification",
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
      return res
        .status(500)
        .json({ error: "Error occurred while sending email", code: err.code });
    }

    const hashedPassword = await bcrypt.hash(newAccount.password, 10);

    const createdAccount = await db.account.create({
      data: {
        ...newAccount,
        password: hashedPassword,
        otp: OTPverif,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", newAccount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { email, verifyOTP } = req.body;
    const accountToVerify = await db.account.findFirst({
      where: { email },
    });

    if (!accountToVerify) {
      return res.status(404).json({
        message: "Please Sign Up before verifying your account",
      });
    }

    if (accountToVerify.isVerified === true) {
      return res
        .status(401)
        .json({ error: "Account has been verified", needLogin: true });
    }

    if (verifyOTP == accountToVerify.otp) {
      await db.account.update({
        where: { id: accountToVerify.id },
        data: { isVerified: true },
      });

      return res.status(200).json({ message: "Account has been verified." });
    } else {
      return res.status(401).json({ error: "OTP is incorrect." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error!" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const account = await db.account.findFirst({ where: { email } });

    if (!account) {
      return res.status(404).json({
        message: "Please Sign Up",
        needSignUp: true,
      });
    }

    if (account.isVerified !== true) {
      return res.status(401).json({
        email: account.email,
        error: "Unverified",
        needVerify: true,
      });
    }

    if (account && (await bcrypt.compare(password, account.password))) {
      const token = generateToken({
        id: account.id,
        username: account.username,
        email: account.email,
        role: account.role,
      });

      return res
        .cookie("Authorization", token, {
          withCredentials: true,
          httpOnly: true,
        })
        .json({
          email: account.email,
          role: account.role,
        });
    } else {
      return res
        .status(401)
        .json({ message: "Wrong password", wrongPassword: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("Authorization");
    res.status(200).json({ message: "You are now logged out." });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.account.delete({ where: { id } });
    res.status(200).json({ message: 'Delete User successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err)
  }
}

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await db.account.findMany();;
    res.status(200).json({ message: 'GetAllUser successful', users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
