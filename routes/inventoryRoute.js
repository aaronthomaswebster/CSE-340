// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by classification view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

router.get("/", invController.buildInventoryManagement)
router.get("/add-classification", invController.buildAddClassification)
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassifcicationData,
    utilities.handleErrors(invController.addClassification)
  )
router.get("/add-inventory", invController.buildAddInventory)
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkVehichleData,
    utilities.handleErrors(invController.addInventory)
  )

  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))




router.get('/edit/:inv_id',  utilities.handleErrors(invController.buildEditInventory));
router.post("/update/", invController.updateInventory)




module.exports = router;