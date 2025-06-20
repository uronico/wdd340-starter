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
  let className = "Vehicles"
  if (data && data.length > 0 && data[0].classification_name) {
    className = data[0].classification_name
  }
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
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const classifications = await invModel.getAllClassifications()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      classifications
    })
  } catch (error) {
    next(error)
  }
}

// Show the add inventory form
invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: [],
    // Sticky values (empty by default)
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: ""
  })
}

// Handle the add inventory POST
invCont.addInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let {
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  } = req.body

  try {
    const result = await invModel.addInventory(
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color
    )
    if (result) {
      req.flash("notice", "Inventory item added successfully!")
      res.redirect("/inv/management")
    } else {
      req.flash("notice", "Failed to add inventory item.")
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: [],
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      })
    }
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Build the edit inventory view
invCont.buildEditInventory = async function(req, res, next) {
  const inv_id = req.params.inv_id
  let nav = await utilities.getNav()
  // fetch the inventory item by inv_id here
  const item = await invModel.getInventoryById(inv_id)
  let classificationList = await utilities.buildClassificationList(item.classification_id)
  const itemName = `${item.inv_make} ${item.inv_model}`
  res.render("inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    item
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ****************************************
*  Build and deliver the delete confirmation view
* *************************************** */
invCont.buildDeleteInventory = async function(req, res, next) {
  try {
    const inv_id = req.params.inv_id
    let nav = await utilities.getNav()
    const item = await invModel.getInventoryById(inv_id)
    const name = `${item.inv_make} ${item.inv_model}`
    res.render("inventory/delete-confirm", {
      title: `Delete ${name}`,
      nav,
      errors: [],
      item
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Carry out the delete of the inventory item
* *************************************** */
invCont.deleteInventory = async function(req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    if (deleteResult) {
      req.flash("notice", "Inventory item deleted successfully!")
      res.redirect("/inv/management")
    } else {
      req.flash("notice", "Delete failed. Please try again.")
      res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}

// Show the delete classification confirmation view
invCont.buildDeleteClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classification_id
  const classification = await invModel.getClassificationById(classification_id)
  res.render("inventory/delete-classification", {
    title: `Delete Classification`,
    nav,
    classification,
    errors: []
  })
}

// Handle the classification deletion
invCont.deleteClassification = async function(req, res, next) {
  const { classification_id } = req.body
  let nav = await utilities.getNav()
  try {
    const result = await invModel.deleteClassification(classification_id)
    if (result) {
      req.flash("notice", "Classification deleted successfully!")
      res.redirect("/inv/management")
    } else {
      req.flash("notice", "Failed to delete classification.")
      const classification = await invModel.getClassificationById(classification_id)
      res.render("inventory/delete-classification", {
        title: "Delete Classification",
        nav,
        classification,
        errors: []
      })
    }
    if (result) {
      req.flash("notice", "Classification deleted successfully!")
      res.redirect("/inv/management")
    } else {
      req.flash("notice", "Failed to delete classification.")
      const classification = await invModel.getClassificationById(classification_id)
      res.render("inventory/delete-classification", {
        title: "Delete Classification",
        nav,
        classification,
        errors: []
      })
    }

  } catch (error) {
    next(error)
  }
}

module.exports = invCont
