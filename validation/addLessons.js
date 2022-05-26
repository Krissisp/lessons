const { check } = require('express-validator');

module.exports = [
  check('lessonCount').isInt().not().isEmpty()
    .escape()
    .withMessage('Должно быть числом')
    .optional(),
  check('firstDate').not().isEmpty().isISO8601()
    .escape(),
  check('lastDate').not().isEmpty().isISO8601()
    .optional()
    .escape(),
  check('teacherIds').not().isEmpty()
    .custom((value) => {
      for (const id of value) {
        if (id != Number(id)) {
          throw new Error('Должно быть числом или числами');
        } else {
          return true;
        }
      }
      return true;
    })
    .escape(),
  check('days').not().isEmpty().escape()
    .custom((value) => {
      for (const id of value) {
        if (id != Number(id)) {
          throw new Error('Должно быть числом или числами');
        } else {
          return true;
        }
      }
      return true;
    }),
  check('title').not().isEmpty().escape(),

];
