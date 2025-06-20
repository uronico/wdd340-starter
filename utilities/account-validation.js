const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

// valid email is required and cannot already exist in the database
body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),

// Login validation rules
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
  ]
}

// Check for login validation errors
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require("../utilities/").getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email
    })
    return
  }
  next()
}

// Account info update rules
validate.accountUpdateRules = () => [
  body("account_firstname").trim().notEmpty().withMessage("First name is required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
  body("account_email")
    .trim()
    .isEmail().withMessage("A valid email is required.")
    .custom(async (email, { req }) => {
      const account = await accountModel.getAccountByEmail(email)
      if (account && account.account_id != req.body.account_id) {
        throw new Error("Email already exists. Please use a different email.")
      }
      return true
    })
]

// Password update rules
validate.passwordUpdateRules = () => [
  body("account_password")
    .isLength({ min: 12 }).withMessage("Password must be at least 12 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
    .matches(/\d/).withMessage("Password must contain a number.")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain a special character.")
]

// Error handlers
validate.checkAccountUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      errors: errors.array(),
      accountData: req.body
    })
  }
  next()
}

validate.checkPasswordUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      errors: errors.array(),
      accountData: req.body
    })
  }
  next()
}

module.exports = validate