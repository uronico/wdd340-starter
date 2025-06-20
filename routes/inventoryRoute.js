// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")
const adminOnly = require("../utilities/account-middleware")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView)

// Intentional 500 error route
router.get("/cause-error", invController.causeError)

router.get("/management", adminOnly, invController.buildManagement)

// Route to build add inventory view
router.get("/add-inventory", adminOnly, invController.buildAddInventory)

// Process the add inventory form
router.post(
  "/add-inventory",
  adminOnly,
  validate.inventoryRules(),           // your validation middleware
  validate.checkInventoryData,         // your validation error handler
  utilities.handleErrors(invController.addInventory)
)

// Route to show the add-classification form
router.get("/add-classification", adminOnly, invController.buildAddClassification)

// Route to process the add-classification form
router.post(
  "/add-classification",
  adminOnly,
  validate.classificationRules(),         
  validate.checkClassificationData,       
  invController.addClassification 
)

// Get inventory for AJAX Route
router.get("/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver the edit inventory view by inventory_id
router.get(
  "/edit/:inv_id",
  adminOnly,
  validate.inventoryRules(),
  utilities.handleErrors(invController.buildEditInventory)
)

router.post(
  "/update-inventory",
  adminOnly,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to deliver the delete confirmation view for an inventory item
router.get(
  "/delete/:inv_id",
  adminOnly,
  utilities.handleErrors(invController.buildDeleteInventory)
)

// Route to process the deletion of an inventory item
router.post(
  "/delete/",
  adminOnly,
  utilities.handleErrors(invController.deleteInventory)
)

// Show delete classification confirmation view
router.get(
  "/delete-classification/:classification_id",
  adminOnly,
  utilities.handleErrors(invController.buildDeleteClassification)
)

// Process classification deletion
router.post(
  "/delete-classification",
  adminOnly,
  utilities.handleErrors(invController.deleteClassification)
)

module.exports = router;