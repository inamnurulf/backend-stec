const express = require("express");
const router = express.Router();

const accountController= require("../controllers/accountController.js");

router.post("/sign-up", accountController.signUp);

router.post("/verify", accountController.verify);

router.post("/log-in", accountController.login);

router.get("/log-out", accountController.logout);

router.delete("/delete-user/:id", accountController.deleteUser);

router.get("/get-all-users", accountController.getAllUser);

module.exports = router;