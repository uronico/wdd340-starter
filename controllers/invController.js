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

invCont.buildDetailView = async function(req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getVehicleById(inv_id)
    if (!data) {
      return next({ status: 404, message: "Vehicle not found." })
    }
    const html = utilities.buildDetailView(data)
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav: await utilities.getNav(),
      detail: html
    })
  } catch (err) {
    next(err)
  }
}

invCont.causeError = function(req, res, next) {
  // Intentionally throw an error
  next(new Error("This is an intentional server error (500) for testing purposes."))
}

module.exports = invCont
