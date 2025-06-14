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
  (req, res) => {
    res.status(200).send('login process')
  }
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.buildLogin) // or your login handler
)

module.exports = router;