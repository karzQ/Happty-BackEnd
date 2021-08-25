const { port, baseUrl: hostname } = require("../config");
const bcrypt = require('bcrypt');
const validator = require('validator');
const multer = require('multer');

exports.get_request_path = (req) => {
  return `http://${hostname}:${port}${req.url}`;
};

/**
 * Generic function to send data from Backend.
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {number} statusCode Status code (Ex: 200, 404, 500)
 * @param {string} method API Method used
 * @param {object} objMessage Message object to define which message to display
 * @param {object} data Data sent
 * @param {boolean} showRequest Define if the request path has to be displayed
 * @return {void}
 */
exports.json_response = (req, res, statusCode, objMessage = { type, objName: null, value: null }, data, showRequest = false) => {
  // console.log({objMessage});
  const { type, objName, value } = objMessage;
  const obj = {
    statusCode,
    method: req.method,
    message: this.get_response_message(type, objName, value),
    data,
    request: this.get_request_path(req),
  };

  // console.log({obj});

  !showRequest && delete obj.request;

  res.status(statusCode).json({
    ...obj,
  });
};

/**
 * Get centralized messages to avoid too many differents messages for the same case.
 * @param {string} type
 * Type of the object
 * @param {string} value
 * Any contextual value, but only primitives.
 * @return {string}
 * The message.
 */
exports.get_response_message = (type, objName, value) => {

  console.log({type, objName, value})

  switch (type) {
    // LOGIN
    case "success_login":
      return `Successfully logged-in`;
    case "email_pwd_couple_error":
      return `Invalid couple Email/Password`;
    case "invalid_password":
        return 'Invalid password';
    case "invalid_email":
        return 'This email not exist';
    case "invalid_password_format":
        return `Invalid format. Your password has to contains at minimum : ${value}`;
    case "invalid_email_format":
        return `Invalid format. Your email has to be like the following example: ${value}`;


    // GET
    case "get_one":
      return `${objName} found`;
    case "get_many":
      return `${value} ${objName}s found`;
    case "no_data":
      return `You have no ${objName}`;

    // UPDATE
    case "update":
      return `Update done`;
    case "update_no_body":
      return `You must at least update one property`;
    case "success_update":
      return `The ${objName} (${value}) has been successfully updated`;

    // DELETE
    case "success_delete":
      return `${objName} ${value} has been successfully deleted.`;

    // CREATE
    case "fields_required":
      return `All fields are required`;
    case "success_create":
      return `${objName} successfully created`;
    case "error_create":
      return `${objName} hasn't been created`;
    case "password_required":
      return `You have to set a password`;
    case "email_wrong_format":
      return `Email don't have the right format`;

    // ERROR
    case "id_required":
      return `Id is required`;
    case "no_data":
      return `No data found`;
    case "wrong_id_format":
      return `You entered wrong ID format`;
    case "server_error":
      return `Server internal error`;
    case "error_occured":
      return `An error has occured`;
    case "not_found":
      return `${objName} not found`;
    case "exist":
      return `This ${objName} already exist`;
    case "not_exist":
      return `This ${objName} not exist`;
    case "forbidden":
      return `Forbidden access`;
    case "admin_only":
      return `Administrator only`;
    case "unhandled_error":
      return `Unhandled Error at ${value}`;
    case "compare_error":
      return `Error in hash comparison`;
    case "invalid_token":
      return "Invalid token";
    case "invalid_format":
      return `${objName} property don't have the right format`;
    case "provide_correct_value":
      return `Please provide a correct ${objName}`;
    case "upload_error":
      return `An upload error has occured, please verify your file.`;
    case "upload_multer_error":
      return `A multer error has occured.`;
    case "not_corresponding":
      return `${objName} id does not corresponding with existing data or ${objName} doesn't exist.`;
    case "already_exist_property":
      return `This ${objName} is already used.`;
    case "value_type_error":
      return `Value type not valid`;

    default:
      return `[Error] - ${type} isn't an available value.`;
  }
};

/**
 * Check major cases for update API Method.
 * @param {object} req
 * Request object.
 * @param {string} identifierName
 * Name of the id property from Req object.
 * @param {function} next
 * Callback for additional code.
 * @return {void} Nothing
 */
exports.check_update = (req, identifierName = null, next) => {
    console.log(req.params)
    if (req.params[`${identifierName}`].length !== 24) {
        throw { type: "wrong_id_format" };
    } else if (Object.keys(req.body).length < 1) {
        throw { type: "update_no_body" };
    } else {
        next();
    }
};

exports.check_get_one = (req, identifierName = null, next) => {
  if (req.params[`${identifierName}`].length !== 24) {
    throw {type: 'wrong_id_format'};
  } else {
    next();
  }
};

/**
 * Check major cases for get API Method
 * @param objProperties
 * Object properties.
 * @param properties
 * Properties to match with req.body content.
 * @param next
 * Callback for additional code.
 * @return {void} Nothing
 */
exports.check_create_element = (objProperties, model, next) => {
  const modelProperties = { ...model.schema.paths };
  delete modelProperties.__v;
  delete modelProperties._id;

  const properties = Object.keys(modelProperties);

  const allPropertiesExist = properties.map((prop) => {
    if (!Object.keys(objProperties).find((val) => val === prop)) {
      return false;
    }
  });

  const valueIsMissing =
    Object.keys(objProperties).map((prop) => {
      return (
        objProperties[`${prop}`] === undefined ||
        objProperties[`${prop}`] === null ||
        objProperties[`${prop}`] === ""
      );
    }) === false;

  if (!allPropertiesExist.find((val) => val === false) && !valueIsMissing) {
    next();
  } else if (
    allPropertiesExist.find((val) => val === false) ||
    valueIsMissing
  ) {
    throw { type: "fields_required" };
  } else {
    throw { type: "unhandled_error", value: "CheckCreateElement" };
  }
};

/**
 * Capitalize a string.
 * @param {*} str String to capitalize.
 * @returns The capitalized string
 */
exports.capitalize = (str) => {
  let firstCharCapitalize = str.charAt(0).toUpperCase();
  const splicedStr = str.slice(1, str.length).toLowerCase();
  return firstCharCapitalize + splicedStr;
};

/**
 * Decrypt a password and return a boolean value.
 * @param {string} inputPassword The password set by the client
 * @param {string} dbPassword The encrypted password get from the Database.
 * @return {boolean} Return the boolean value of comparison between the client password and the db-hashed password.
 */
exports.decryptPassword = async (inputPassword, dbPassword) => {
    const value = await bcrypt.compare(inputPassword, dbPassword)
    console.log({value})
    if (value === true) {
        return value;
    } else {
        return false;
    }
};

exports.getDocumentsCount = (model) => {
  try {
    let modelCount = 0;
    model.countDocuments({}, (err, count) => {
      if (err) {
        throw `An error has occurred while counting ${model.name} collection`;
      } else {
        /* if (count === 0) {
          this.getDocumentsCount(model);
        } */
        modelCount = count;
      }
    });
    // console.log({ modelCount });
    return modelCount + 1;
  } catch (err) {
    console.log(err);
  }
};

exports.formatUsername = (username, usersCount) => {
//   console.log({ usersCount });
  let uniqueIdentifier = `${usersCount}`;
  while (uniqueIdentifier.length < 6) {
    uniqueIdentifier = "0" + uniqueIdentifier;
  }
  return `${username}#${uniqueIdentifier}`;
};

/**
 * Change the existing 
 * @param {string} current 
 */
exports.changeUsername = (replacement, current) => {
    const splitStr = current.split('#');
    return `${replacement}#${splitStr[1]}`;
};

exports.generateAccessCode = async (User) => {
    const maxChar = 12;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let accessCode = '';

    let i = 0;
    while(i < maxChar) {
        accessCode += characters[Math.floor(Math.random() * (60 - 1 + 1)) + 1];
        i++;
    }

    await User.findOne({accessCode}, async (err, user) => {
        if (err) {
            statusCode = 500;
            throw err;
        } else if (user) {
            console.log({users});
            if (user.accessCode === accessCode) {
                this.generateUniqueCode(User);
            } else {
                return accessCode;
            }
        } else if (!user) {
            console.log("in : ", accessCode )
            return accessCode;
        } else {
            statusCode = 500;
            throw {type: 'server_error'};
        }
    });
}

exports.checkPhoneNumber = async (phoneValue = '') => {
  if (phoneValue.length < 10) {
    throw {type: 'invalid_format', objName: 'Phone'}
  } else if (!validator.isMobilePhone(phoneValue)) {
    throw {type: 'provide_correct_value', objName: 'phone number'}
  } else if (validator.isMobilePhone(phoneValue)) {
    return phoneValue;
  } else {
    throw {type: 'server_error'}
  }
}

exports.checkPasswordComplexity = async (password) => {
  const minLength = 4;
  if (validator.isStrongPassword(password, {minLength})) {
    return password;
  } else if (!validator.isStrongPassword(password, {minLength})) {
    throw {type: 'invalid_password_format', value: `8 characters with 1 UpperCased letter, 1 Number and 1 Symbol`};
  } else {
    throw {type: 'server_error'}
  }
}

exports.checkEmail = async (email) => {
  if (validator.isEmail(email)) {
    return email;
  } else if (!validator.isEmail(email)) {
    throw {type: 'invalid_email_format', value: 'john.doe@gmail.com'}
  } else {
    throw {type: 'server_error'}
  }
}

exports.checkSearchValue = (value = '') => {
  if (value.endsWith('#', value.length - 6)) {
    return 'pseudo';
  } else if (validator.isEmail(value)) {
    return 'email';
  } else if (validator.isMobilePhone(value)) {
    return 'phone';
  } else {
    throw {type: 'value_type_error'};
  }
}