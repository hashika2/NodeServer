const Joi = require("joi");
const { validateObject } = require("../../../shared/utilities");

const username = Joi.string().min(5).max(50).required();
const email = Joi.string().required();
const password = Joi.string().required();
const token = Joi.string().required();

const validateLoginAttributes = (insertAttributes) => {
  const schema = {
    email,
    password,
  };
  return validateObject(schema, insertAttributes);
};

const validateResetAttributes = (insertAttributes) => {
  const schema = {
    email,
  };
  return validateObject(schema, insertAttributes);
};

const validateConfirmAttributes = (insertAttributes) => {
  const schema = {
    token,
  };
  return validateObject(schema, insertAttributes);
};

const validateRegisterAttributes = (insertAttributes) => {
  const schema = {
    username,
    email,
    password,
  };
  return validateObject(schema, insertAttributes);
};

const validateTokenAttributes = (insertAttributes) => {
  const schema = {
    token,
  };
  return validateObject(schema, insertAttributes);
};

module.exports = {
  validateLoginAttributes,
  validateRegisterAttributes,
  validateResetAttributes,
  validateTokenAttributes,
};
