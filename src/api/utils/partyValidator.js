const joi = require("joi");

const partyValidator = joi.object({
  name: joi.string().required().trim(),
  description: joi.string().trim().required(),
  date: joi.string().trim().required(),
  location: joi.string().trim().required(),
});

module.exports = partyValidator;
