const express = require("express");
const router = express.Router();

const accountController= require("../controllers/accountController.js");

router.post("/sign-up", accountController.signUp);

router.post("/verify", accountController.verify);

router.post("/log-in", accountController.login);

router.get("/log-out", accountController.logout);

module.exports = router;