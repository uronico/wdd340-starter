// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView)

// Intentional 500 error route
router.get("/cause-error", invController.causeError)

router.get("/management", invController.buildManagement)

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory)

// Process the add inventory form
router.post(
  "/add-inventory",
  validate.inventoryRules(),           // your validation middleware
  validate.checkInventoryData,         // your validation error handler
  utilities.handleErrors(invController.addInventory)
)

// Route to show the add-classification form
router.get("/add-classification", invController.buildAddClassification)

// Route to process the add-classification form
router.post(
  "/add-classification",
  validate.classificationRules(),         
  validate.checkClassificationData,       
  invController.addClassification 
)

// Get inventory for AJAX Route
router.get("/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;