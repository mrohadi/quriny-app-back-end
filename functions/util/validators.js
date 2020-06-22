// Helper Function to check an email
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(regEx)) return true;
  else return false;
};

// Helper function to determine the string is empy or not
const isEmpy = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

// Check if there is an error
exports.validateSignupData = (data) => {
  let errors = {};
  if (isEmpy(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email adress";
  }

  if (isEmpy(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Password must be match";
  if (isEmpy(data.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Check if there is an error
exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpy(data.email)) errors.email = "Must not be empty";
  if (isEmpy(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpy(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpy(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpy(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
