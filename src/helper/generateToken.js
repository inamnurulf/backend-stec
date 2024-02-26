const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret"

const generateToken = (payload) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: "3d" });
  };
  
  module.exports = generateToken;