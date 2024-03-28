const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

const firstNameRule = body("account_firstname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 1 })
  .withMessage("Please provide a first name."); // on error this message is sent.

// lastname is required and must be string
const lastNameRule = body("account_lastname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 2 })
  .withMessage("Please provide a last name."); // on error this message is sent.

// valid email is required and cannot already exist in the DB
const emaileRule = body("account_email")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.");

const emailExists = body("account_email").custom(async (account_email) => {
  const emailExists = await accountModel.checkExistingEmail(account_email);
  if (emailExists) {
    throw new Error("Email exists. Please log in or use different email");
  }
});

// password is required and must be strong password
const passwordRule = body("account_password")
  .trim()
  .notEmpty()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password does not meet requirements.");
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [firstNameRule, lastNameRule, emaileRule,emailExists, passwordRule];
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error(
            "Email does not exist. Please register or use different email"
          );
        }
      }),
    passwordRule,
  ];
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      account_password,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Account Update Data Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
  return [firstNameRule, lastNameRule, emaileRule];
};
/*  **********************************
 *  Password Chane Data Validation Rules
 * ********************************* */
validate.passwordChangeRules = () => {
  return [passwordRule];
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkAccountUpdateData = async (req, res, next) => {
  const {  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/updateAccount", {
      errors,
      title: "Account Update",
      nav
    });
    return;
  }
  next();
};

module.exports = validate;
