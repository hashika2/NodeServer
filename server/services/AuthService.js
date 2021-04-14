const { User } = require("../shared/database/entities/User");
const jwt = require("jsonwebtoken");
const database = require("../../dbConnection");
const config = require("../shared/environment/config");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const AWS = require('aws-sdk');

database.db();
const RegisterService = async (username, email, password, res) => {
  try {
    const user = new User({
      name: username,
      email: email,
      password: password,
    });

    /** sign up with aws cognito  **/
   /* const poolData = {
      ClientId: config.ClientId,
      UserPoolId: config.UserPoolId,
    };
    let attributeList = [];
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const emailData = {
      Name: "email",
      Value: email,
    };
    const emailAttribues = new AmozonCognitoIdentity.CognitoUserAttribute(
      emailData
    );
    attributeList.push(emailAttribues);
    console.log(emailAttribues);
    userPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        console.log(err);

        return res.send(err);
      }

      console.log(data.user);
      return res.send(data.user);
    });*/

    await User.findOne({ email: user.email }, function (err, user) {
      if (err) return res.status(400).json({ success: false });
      if (user) return res.status(400).json({ error: "User Already Exist" });
    });

    user.save();
    const payload = { id: user.id, name: user.name };
    const token = await jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: 3600,
    });
    const refershToken = await jwt.sign(payload, process.env.REFRESH_KEY, {});
    const accessToken = {
      accessToken: token,
      refershToken: refershToken,
      user: email,
    };
    res.header("auth-token", accessToken).send({ token: accessToken });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const LoginService = async (email, password, res) => {
  try {
    const authenticationData = {
      Username:email,
      Password:password
    }

    /** signIn with aws cognito and get token **/
    const authenticationDetails = new AmozonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const poolData = {
      ClientId: config.ClientId,
      UserPoolId: config.UserPoolId,
    };
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username:email,
      Pool: userPool
    }
    const cognitoUser = new AmozonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (session) {
        const tokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken()
        };
        cognitoUser['tokens'] = tokens; // Save tokens for later use
        console.log(cognitoUser)
        return res.send(cognitoUser); // Resolve user
      },
      onFailure: function (err) {
        return res.send(err); // Reject out errors
      },
    })



    // User.findOne({ email }).then((user) => {
    //   if (!user) {
    //     const error = "User not found";
    //     return res.status(404).json(error);
    //   }

    //   // Check Password
    //   bcrypt.compare(password, user.password).then((isMatch) => {
    //     if (isMatch) {
    //       const payload = { id: user.id, name: user.name };
    //       const token = jwt.sign(payload, process.env.JWT_KEY, {
    //         expiresIn: 3600,
    //       });
    //       const refershToken = jwt.sign(payload, process.env.REFRESH_KEY, {});
    //       const accessToken = {
    //         accessToken: token,
    //         refershToken: refershToken,
    //         user: email,
    //       };
    //       res.cookie("jwt", accessToken, { httpOnly: true, macAge: 50000 });
    //       res.header("auth-token", accessToken).send({ token: accessToken });
    //     } else {
    //       return res.status(400).json({ error: "Password incorrect" });
    //     }
    //   });
    // });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const LogoutService = (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
};

module.exports = { RegisterService, LoginService, LogoutService };
