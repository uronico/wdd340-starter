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

invCont.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav
  })
}

invCont.buildAddInventory = async function(req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      nav
    })
  } catch (error) {
    next(error)
  }
}

// Show the add-classification form
invCont.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav
  })
}

// Handle the form POST
invCont.addClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      // Success: show management view with success message
      nav = await utilities.getNav() // update nav to include new classification
      req.flash("notice", "Classification added successfully!")
      res.redirect("/inv/management")
    } else {
      // Failure: show form with error
      req.flash("notice", "Failed to add classification.")
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        classification_name
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
