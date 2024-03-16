const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
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


module.exports = invCont