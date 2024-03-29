const isEmpty = (string) => {
    if (string.trim() === "") return true;
    else return false;
};

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

export function validateSignupData(data) {
    // Error Checking for Sign Up
    let errors = {};
    
    if (isEmpty(data.email)) {
      errors.email = "Must not be empty";
    } else if (!isEmail(data.email)) {
      errors.email = "Must be a valid email address";
    }
    
    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords must match";
    if (isEmpty(data.userName)) errors.userName = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

export function validateLoginData(data) {
    let errors = {};
    if (isEmpty(data.email)) errors.email = "Must not be empty";
    if (isEmpty(data.password)) errors.password = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

export function reduceUserDetails(data) {
  let userDetails = {};

  if (!isEmpty(data.userName.trim())) userDetails.userName = data.userName.trim();

  userDetails.bio = data.bio.trim();

  if (!isEmpty(data.website.trim()) && data.website.trim().substring(0, 4) !== 'http') {
    userDetails.website = `https://${data.website.trim()}`;
  } else {
    userDetails.website = data.website.trim();
  }

  userDetails.location = data.location.trim();

  return userDetails;
}