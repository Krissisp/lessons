const { lessons, lesson_teachers } = require('../entities/entities');

function createLesson(arrayData, title, currentLastDate, teacherIds) {
  return arrayData.push(lessons.create({
    title,
    date: currentLastDate,
    status: 0,
    raw: true,
  }).then((result) => {
    for (const id of teacherIds) {
      lesson_teachers.create({
        lesson_id: result.dataValues.id,
        teacher_id: id,
        raw: true,
      });
    }
    return result.dataValues.id;
  }));
}

module.exports = createLesson;
