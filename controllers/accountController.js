const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account view
 * *************************************** */
async function buildMyAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/myAccount", {
    title: "My Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Update Account
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    res.locals.accountData.account_id
  );
  if (updateResult) {
    res.locals.accountData.account_firstname = account_firstname;
    res.locals.accountData.account_lastname = account_lastname;
    res.locals.accountData.account_email = account_email;
    req.flash("notice", `Congratulations, you\'ve updated your account`);
    res.status(201).render("account/updateAccount", {
      title: "Update Account",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the accout Update failed.");
    res.status(501).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Change Password
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
  const updateResult = await accountModel.changePassword(
    hashedPassword,
    res.locals.accountData.account_id
  );
  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your account password`
    );
    res.status(201).render("account/updateAccount", {
      title: "Update Account",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the Pasword update failed.");
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  logout
 * *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  let nav = await utilities.getNav();
  req.flash("notice", "You have been logged out.");
  res.status(200).render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildMyAccount,
  buildUpdateAccount,
  updateAccount,
  changePassword,
  accountLogout,
};
