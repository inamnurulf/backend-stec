const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const saltRounds = parseInt(process.env.SALTROUNDS, 10);
const jwt = require("jsonwebtoken");
const generateOTP = require("../helper/generateOTP")

exports.signUp = async (req, res, next) => {
  try {
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
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
