// Order form validation, shared by the client form and the /api/orders route.

// Accepts 01XXXXXXXXX, +8801XXXXXXXXX or 8801XXXXXXXXX (spaces/dashes allowed)
// and returns the local 11-digit form, or null if it isn't a valid BD mobile.
export function normalizeBDPhone(value) {
  let digits = String(value || "").replace(/[\s\-()]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("880")) digits = digits.slice(2);
  // Operator prefixes: 013–019
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns { field: message } for every invalid field; empty object when valid.
export function validateOrder({ name, phone, email, address, notes }) {
  const errors = {};
  name = String(name || "").trim();
  phone = String(phone || "").trim();
  email = String(email || "").trim();
  address = String(address || "").trim();
  notes = String(notes || "").trim();

  if (!name) errors.name = "Please enter your full name.";
  else if (name.length < 3) errors.name = "Name must be at least 3 characters.";
  else if (name.length > 60) errors.name = "Name must be 60 characters or fewer.";
  else if (/\d/.test(name)) errors.name = "Name should not contain numbers.";

  if (!phone) errors.phone = "Please enter your phone number.";
  else if (!normalizeBDPhone(phone))
    errors.phone = "Enter a valid Bangladeshi mobile number, e.g. 01712345678.";

  if (email && !EMAIL_RE.test(email))
    errors.email = "Enter a valid email address, e.g. name@example.com.";

  if (!address) errors.address = "Please enter your delivery address.";
  else if (address.length < 10)
    errors.address = "Please give a fuller address (house/road, area, city).";
  else if (address.length > 300) errors.address = "Address must be 300 characters or fewer.";

  if (notes.length > 500) errors.notes = "Notes must be 500 characters or fewer.";

  return errors;
}
