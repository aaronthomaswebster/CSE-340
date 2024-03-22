const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  console.log({classification_id});
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  console.log(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by vehicle view
 * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId  
  const data = await invModel.getInventoryById(vehicle_id)
  const grid = await utilities.buildVehicleDetails(data)
  let nav = await utilities.getNav()
  console.log(data)
  const vehicleTitle = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/vehicle", {
    title: vehicleTitle,
    nav,
    grid,
  })
}


/* ***************************
 *  "Vehichle Management view
 * ************************** */
invCont.buildInventoryManagement =  async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehichle Management",
    nav,
    errors: null
  })
}



/* ***************************
 *  Add classification view
 * ************************** */


invCont.buildAddClassification =  async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}



/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClassification =  async function(req, res) {
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(
    classification_name
  )
  let nav = await utilities.getNav()

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added a new classification: ${classification_name}`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehichle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, creating a new classification failed. Please try again.")
    res.status(501).render("/inv/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    })
  }
}




invCont.buildAddInventory =  async function(req, res, next) {
  let nav = await utilities.getNav()
  let classification_select = await utilities.buildClassificationList()
  res.render("./inventory/add-Inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    
    classification_select
  })
}


/* ****************************************
*  Process Add Inventory
* *************************************** */
invCont.addInventory =  async function(req, res) {
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
    classification_id } = req.body
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
  )
  let nav = await utilities.getNav()

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added a new Vehichle: ${inv_make} ${inv_model}`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehichle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, creating a new classification failed. Please try again.")
    
   let classification_select = await utilities.buildClassificationList()
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
      classification_select
    })
  }
}



module.exports = invCont