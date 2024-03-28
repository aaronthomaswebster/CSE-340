// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId",  utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:vehicleId",  utilities.handleErrors(invController.buildByVehicleId));

router.get("/",  utilities.checkAdminOrAdmin,utilities.handleErrors(invController.buildInventoryManagement))
router.get("/add-classification", utilities.checkAdminOrAdmin, utilities.handleErrors(invController.buildAddClassification))
router.post(
    "/add-classification",utilities.checkAdminOrAdmin,
    invValidate.classificationRules(),
    invValidate.checkClassifcicationData,
    utilities.handleErrors(invController.addClassification)
  )
router.get("/add-inventory", utilities.checkAdminOrAdmin,invController.buildAddInventory)
router.post(
    "/add-inventory",utilities.checkAdminOrAdmin,
    invValidate.inventoryRules(),
    invValidate.checkVehichleData,
    utilities.handleErrors(invController.addInventory)
  )

  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))




router.get('/edit/:inv_id',utilities.checkAdminOrAdmin,  utilities.handleErrors(invController.buildEditInventory));
router.post("/update/",  utilities.checkAdminOrAdmin,utilities.handleErrors(invController.updateInventory))


router.get('/delete/:inv_id',utilities.checkAdminOrAdmin,  utilities.handleErrors(invController.buildDeleteInventory));
router.post("/delete/", utilities.checkAdminOrAdmin, utilities.handleErrors(invController.deleteInventory))




module.exports = router;