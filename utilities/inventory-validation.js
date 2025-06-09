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

module.exports = validate