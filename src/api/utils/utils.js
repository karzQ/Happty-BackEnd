const bcrypt = require('bcrypt');

/**
 * Function which return a capitalized string value. (The first char of the string in parameter will get his entire value LowerCased, and his first char will be UpperCased).
 * @param {String} str String value to capitalize (Firstname for example).
 * @returns {String} The capitalized text.
 */
exports.capitalize = (str) => {
    let firstCharCapitalize = str.charAt(0).toUpperCase();
    const splicedStr = str.slice(1, str.length).toLowerCase();
    return firstCharCapitalize + splicedStr;
}

/**
 * Decrypt a password, and return a boolean value if it's the same or not.
 * @param {*} inputPassword The password set by the client
 * @param {*} dbPassword The encrypted password get through the Database. 
 */
exports.decryptPassword = async (inputPassword, dbPassword) => {
  bcrypt.compare(inputPassword, dbPassword, (err, result) => {
    if (err || result === false) {
      throw "Passwords not equals";
    } else {
      return result;
    }
  });
}