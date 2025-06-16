const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 1 }).withMessage("Classification name is required.")
    .matches(/^[A-Za-z0-9]+$/).withMessage("Only letters and numbers allowed. No spaces or special characters.")
]

validate.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
  }
  next()
}

validate.inventoryRules = () => [
  body("classification_id")
    .notEmpty().withMessage("Classification is required."),
  body("inv_make")
    .trim()
    .isLength({ min: 1 }).withMessage("Make is required."),
  body("inv_model")
    .trim()
    .isLength({ min: 1 }).withMessage("Model is required."),
  body("inv_year")
    .isInt({ min: 1900, max: 2099 }).withMessage("Year must be between 1900 and 2099."),
  body("inv_description")
    .trim()
    .isLength({ min: 1 }).withMessage("Description is required."),
  body("inv_image")
    .trim()
    .isLength({ min: 1 }).withMessage("Image path is required."),
  body("inv_thumbnail")
    .trim()
    .isLength({ min: 1 }).withMessage("Thumbnail path is required."),
  body("inv_price")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("inv_miles")
    .isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
  body("inv_color")
    .trim()
    .isLength({ min: 1 }).withMessage("Color is required.")

  ] 

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  let nav = await require("../utilities/").getNav()
  let classificationList = await require("../utilities/").buildClassificationList(req.body.classification_id)
  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      // Sticky values
      ...req.body
    })
  }
  next()
}

module.exports = validate