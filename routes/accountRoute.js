/* ***********************
 * Account Routes, Delivery login view activity
 *************************/

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route for delivery login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route for delivery register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route for process registration
router.post('/register', regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Deliver the account update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccount))

// Process account info update
router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt") // or whatever your JWT cookie name is
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
})

module.exports = router;