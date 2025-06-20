module.exports = function(req, res, next) {
  // Check if JWT and accountData exist and account_type is Employee or Admin
  if (
    res.locals.accountData &&
    (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")
  ) {
    return next()
  } else {
    req.flash("notice", "You must be logged in as an Employee or Admin to access that page.")
    return res.redirect("/account/login")
  }
}