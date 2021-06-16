const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;

exports.verify_token = (req, res, next) => {
  let token = req.headers["authorization"];
  let statusCode = 200;

  try {
    if (typeof token !== "undefined") {
      jwt.verify(token, JWT_TOKEN, (err, decoded) => {
        if (err) {
          throw "Forbidden access";
        } else {
          res.locals.token = decoded;
          next();
        }
      });
    } else {
      throw "Forbidden access";
    }
  } catch (err) {
    statusCode = 403;
    res.status(statusCode).json({
      message: err,
    });
  }
};
