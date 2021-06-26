const express = require("express");
const router = express.Router();
const { Register, Login, Logout, ResetPassword, ConfirmPassword } = require("./Auth");

router.post("/", (req, res) => {
  const register = Register(req, res);
  return register;
});

router.post("/login", (req, res) => {
  const login = Login(req, res);
  return login;
});

router.post("/reset", (req, res) => {
  const login = ResetPassword(req, res);
  return login;
});

router.post("/confirm", (req, res) => {
  const login = ConfirmPassword(req, res);
  return login;
});

router.post("/logout", (req, res) => {
  const logout = Logout(req, res);
  return logout;
});

module.exports = router;
