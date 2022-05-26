const db = require('../db');
const { lesson_students } = require('../entities/entities');

async function getmaxStudentsCount() {
  const maxVisitCount = lesson_students.findAll({
    attributes: [
      db.fn('count', db.col('student_id')),
    ],
    group: ['lesson_students.lesson_id'],
    raw: true,
  }).then((result) => result.map((lesson) => lesson.count));
  return Math.max(...(await maxVisitCount));
}
module.exports = getmaxStudentsCount;
