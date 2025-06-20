// Simple client-side validation for account update
function validateAccountUpdateForm(event) {
  const first = document.getElementById('account_firstname');
  const last = document.getElementById('account_lastname');
  const email = document.getElementById('account_email');
  let valid = true;
  if (!first.value.trim()) { valid = false; first.focus(); }
  else if (!last.value.trim()) { valid = false; last.focus(); }
  else if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { valid = false; email.focus(); }
  if (!valid) {
    alert("All fields are required and email must be valid.");
    event.preventDefault();
  }
}

// Simple client-side validation for password update
function validatePasswordForm(event) {
  const password = document.getElementById('account_password');
  // Example: at least 12 chars, 1 uppercase, 1 number, 1 special char
  const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
  if (!pattern.test(password.value)) {
    alert("Password must be at least 12 characters and include an uppercase letter, a number, and a special character.");
    password.focus();
    event.preventDefault();
  }
}