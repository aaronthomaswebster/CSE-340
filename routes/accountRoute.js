// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildMyAccount)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);


router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  "/change-password",
  regValidate.passwordChangeRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.changePassword)
);

router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
);

// Route to build inventory by classification view
router.get("/favorites",  utilities.handleErrors(accountController.buildMyFavorites));

// Route to build inventory by classification view
router.get("/favorites/:inv_id/add",  utilities.handleErrors(accountController.addFavorite));

// Route to build inventory by classification view
router.get("/favorites/:inv_id/remove",  utilities.handleErrors(accountController.removeFavorite));

module.exports = router;
