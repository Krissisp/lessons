const { validationResult } = require('express-validator');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).jsonp(errors.array());
  }
  return errors;
}

module.exports = validate;
