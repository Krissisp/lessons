const { check } = require('express-validator');

module.exports = [
  check('status').isInt().not().isEmpty()
    .escape()
    .withMessage('Должно быть числом')
    .optional(),
  check('date').not().isEmpty().escape()
    .custom((value) => {
      const [num1, num2] = value.split(',');
      if (new Date(num1) == 'Invalid Date' && num1 !== undefined) {
        throw new Error('Невалидная дата');
      }
      if (new Date(num2) == 'Invalid Date' && num2 !== undefined) {
        throw new Error('Невалидная дата');
      } else {
        return true;
      }
    })
    .optional(),
  check('teacherIds').not().isEmpty().escape()
    .custom((value) => {
      for (const id of value.split(',')) {
        if (id != Number(id)) {
          throw new Error('Должно быть числом или числами');
        } else {
          return true;
        }
      }
      return true;
    })
    .optional(),
  check('studentsCount').not().isEmpty().escape()
    .custom((value) => {
      const [num1, num2] = value.split(',');
      if (num1 != Number(num1) && num1 !== undefined) {
        throw new Error('Должно быть числом или числами');
      }
      if (num2 != Number(num2) && num2 !== undefined) {
        throw new Error('Должно быть числом или числами');
      } else {
        return true;
      }
    })
    .optional(),
  check('page').isInt().not().isEmpty()
    .escape()
    .withMessage('Должно быть числом')
    .optional(),
  check('lessonsPerPage').isInt().not().isEmpty()
    .escape()
    .withMessage('Должно быть числом')
    .optional(),
];
