const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  console.log({ classification_id });
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const classificationList = await invModel.getClassifications();
  let currentClassification = classificationList.rows.find( 
    (classification) => classification.classification_id == classification_id
  );

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  console.log(data);
  const className = currentClassification.classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by vehicle view
 * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const data = await invModel.getInventoryById(vehicle_id, res?.locals?.accountData?.account_id);
  const grid = await utilities.buildVehicleDetails(data,  res?.locals?.accountData?.account_id != null);
  let nav = await utilities.getNav();
  console.log(data);
  const vehicleTitle =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/vehicle", {
    title: vehicleTitle,
    nav,
    grid,
  });
};

/* ***************************
 *  "Vehichle Management view
 * ************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehichle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ***************************
 *  Add classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Add Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const regResult = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added a new classification: ${classification_name}`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehichle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, creating a new classification failed. Please try again."
    );
    res.status(501).render("/inv/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    });
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,

    classificationSelect
  });
};

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
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
  const regResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  let nav = await utilities.getNav();

  let classificationSelect = await utilities.buildClassificationList();
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added a new Vehichle: ${inv_make} ${inv_model}`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehichle Management",
      nav,
      errors: null,
      classificationSelect
    });
  } else {
    req.flash(
      "notice",
      "Sorry, creating a new classification failed. Please try again."
    );

    res.status(501).render("/inv/add-inventory", {
      title: "Add New Classification",
      nav,
      errors: null,
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
      classificationSelect,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build Edit Inventory
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let itemData = await invModel.getInventoryById(inv_id);
  console.log({ itemData: itemData[0] });
  const classificationSelect = await utilities.buildClassificationList(
    itemData[0].classification_id
  );
  itemData = itemData[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};




/* ***************************
 *  Build Delete Inventory
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let itemData = await invModel.getInventoryById(inv_id);
  console.log({ itemData: itemData[0] });
  const classificationSelect = await utilities.buildClassificationList(
    itemData[0].classification_id
  );
  itemData = itemData[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id
  } = req.body;
  const deleteResult = await invModel.deleteInventory(
    inv_id
  );
  
  let classificationSelect = await utilities.buildClassificationList();
  if (deleteResult) {
    req.flash("notice", `The Inventory Item was successfully Deleted.`);
    res.status(201).render("./inventory/management", {
      title: "Vehichle Management",
      nav,
      errors: null,
      classificationSelect 
    });
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete-inventory", {
      title: "Delete Inventory",
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};
module.exports = invCont;
