require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const accountRoute = require("./src/routes/accountRoute");
const todoRoute = require("./src/routes/todoRoute");

const { isLoggedIn } = require("./src/middlewares/authorization");

const app = express();
const frontendDomain = process.env.DOMAIN_FRONTEND || "*";
app.use(
  cors({
    origin: frontendDomain,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1000mb" }));
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});

app.use("/account", accountRoute);
app.use("/todo", isLoggedIn, todoRoute);
