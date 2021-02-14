const { User } = require("../shared/database/entities/User");
const jwt = require("jsonwebtoken");
const database = require("../../dbConnection");
require("dotenv").config();
const bcrypt = require("bcryptjs");

database.db();
const RegisterService = async (username, email, password, res) => {
  try {
    const user = new User({
      name: username,
      email: email,
      password: password,
    });
    await User.findOne({ email: user.email }, function (err, user) {
      if (err) return res.status(400).json({ success: false });
      if (user) return res.status(400).json({ error: "User Already Exist" });
    });

    user.save();
    const payload = { id: user.id, name: user.name };
    const token = await jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: 3600,
    });
    const accessToken = {
      accessToken: token,
      user: email,
    };
    res.header("auth-token", accessToken).send({ token: accessToken });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const LoginService = async (email, password, res) => {
  try {
    User.findOne({ email }).then((user) => {
      if (!user) {
        const error = "User not found";
        return res.status(404).json(error);
      }

      // Check Password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = { id: user.id, name: user.name };
          const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: 3600,
          });
          const accessToken = {
            accessToken: token,
            user: email,
          };
          res.header("auth-token", accessToken).send({ token: accessToken });
        } else {
          return res.status(400).json({ error: "Password incorrect" });
        }
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { RegisterService, LoginService };
