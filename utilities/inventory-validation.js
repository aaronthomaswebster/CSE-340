const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/*  **********************************
 *  Classification Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // firstname is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a name for your classification.")
      .isAlpha()
      .withMessage("Your name must contain only alphabetic characters."),
  ];
};
/* ******************************
 * Check data and return errors or continue to Vehicle Management
 * ***************************** */
validate.checkClassifcicationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Inventory Rules
 * ********************************* */

// inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make.")
      .isAlpha()
      .withMessage("Make must be alphabetic characters only."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model.")
      .isAlpha()
      .withMessage("Model must be alphabetic characters only."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a year.")
      .isNumeric()
      .withMessage("Year must be numeric."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an image."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a price.")
      .isNumeric()
      .withMessage("Price must be numeric."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a mileage.")
      .isNumeric()
      .withMessage("Mileage must be numeric."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color.")
      .isAlpha()
      .withMessage("Color must be alphabetic characters only."),
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a classification.")
      .isNumeric()
      .withMessage("Classification must be numeric."),
  ];
};

/* ******************************
 * Check data and return errors or continue to Vehicle Management
 * ***************************** */
validate.checkVehichleData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let classificationSelect = await utilities.buildClassificationList()
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationSelect
    });
    return;
  }
  next();
};
module.exports = validate;
