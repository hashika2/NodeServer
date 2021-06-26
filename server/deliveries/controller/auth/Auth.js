const {
  RegisterService,
  LoginService,
  LogoutService,
  ResetPasswordService,
  ConfirmPasswordService
} = require("../../../services/AuthService");
const {
  validateLoginAttributes,
  validateRegisterAttributes,
  validateTokenAttributes,
  validateResetAttributes
} = require("./authAttributesValidation");
const validateHeaders = require("../../../shared/validateHeaders");

const Register = (req, res) => {
  const checkHeaders = validateHeaders(req);
  if (!checkHeaders) {
    return res.status(400).json({ error: "Custom headers are not supplied" });
  }
  const { username, email, password } = req.body;
  const validateResult = validateRegisterAttributes({
    username,
    email,
    password,
  });
  if (validateResult.error) {
    return res
      .status(400)
      .json({ error: validateResult.error.details[0].message });
  }

  const registerService = RegisterService(username, email, password, res);
  return registerService;
};

const Login = (req, res) => {
  const checkHeaders = validateHeaders(req);
  if (!checkHeaders) {
    return res.status(400).json({ error: "Custom headers are not supplied" });
  }
  const { email, password } = req.body;
  const validateResult = validateLoginAttributes({ email, password });
  if (validateResult.error) {
    return res
      .status(400)
      .json({ error: validateResult.error.details[0].message });
  }

  const loginService = LoginService(email, password, res);
  return loginService;
};

const ResetPassword = (req, res) => {
  const checkHeaders = validateHeaders(req);
  if (!checkHeaders) {
    return res.status(400).json({ error: "Custom headers are not supplied" });
  }
  const { email } = req.body;
  const validateResult = validateResetAttributes({ email });
  if (validateResult.error) {
    return res
      .status(400)
      .json({ error: validateResult.error.details[0].message });
  }

  const resetPasswordService = ResetPasswordService(email, res);
  return resetPasswordService;
};

const ConfirmPassword = (req, res) => {
  const checkHeaders = validateHeaders(req);
  if (!checkHeaders) {
    return res.status(400).json({ error: "Custom headers are not supplied" });
  }
  const { token,userId,password } = req.body;
  const resetPasswordService = ConfirmPasswordService(token,userId,password, res);
  return resetPasswordService;
};

const User = (req, res) => {
  const checkHeaders = validateHeaders(req);
  if (!checkHeaders) {
    return res.status(400).json({ error: "Custom headers are not supplied" });
  }
  const { email, password } = req.body;
  const validateResult = validateLoginAttributes({ email, password });
  if (validateResult.error) {
    return res
      .status(400)
      .json({ error: validateResult.error.details[0].message });
  }

  const loginService = LoginService(email, password, res);
  return loginService;
};

const Logout = (req, res) => {
  const checkHeaders = validateHeaders(req);
  if (!checkHeaders) {
    return res.status(400).json({ error: "Custom headers are not supplied" });
  }
  const { token } = req.body;
  const validateResult = validateTokenAttributes({ token });
  if (validateResult.error) {
    return res
      .status(400)
      .json({ error: validateResult.error.details[0].message });
  }

  const logoutService = LogoutService(email, password, res);
  return logoutService;
};

module.exports = { Register, Login, ResetPassword,ConfirmPassword, User, Logout };
