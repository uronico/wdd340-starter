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

router.get("/management", utilities.handleErrors(invController.buildManagement))

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to show the add-classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to process the add-classification form
router.post(
  "/add-classification",
  validate.classificationRules(),         
  validate.checkClassificationData,       
  utilities.handleErrors(invController.addClassification) 
)

module.exports = router;