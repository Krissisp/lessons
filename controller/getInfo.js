const Sequelize = require('sequelize');
const db = require('../db');
const {
  lessons, teachers, students, lesson_students,
} = require('../entities/entities');
const maxVisitCount = require('../services/MaxStudentsCount');
const getDefaultDate = require('../services/defaultValue');
const validate = require('../utils/validationData');

const { Op } = Sequelize;

const getInfo = async (req, res) => {
  validate(req, res);
  const {
    date = await getDefaultDate(), status, studentsCount = `0,${await maxVisitCount()}`, teacherIds, page = 1, lessonsPerPage = 10,
  } = req.query;
  const teacherAllIds = teachers.findAll({
    attributes: ['id'],
  }).then((result) => result.map((teacher) => teacher.id));

  const splitDate = date.split(',');
  const studentsCountSplit = studentsCount.split(',');
  // запрос, который находит подходящие id урококов по количеству студентов

  const lessonInCount = lesson_students.findAll({
    attributes: ['lesson_id', [(db.fn('count', db.col('student_id'))), 'studentCount']],
    where: {
      lesson_id: {
        [Op.between]:
          [studentsCountSplit[0], studentsCountSplit[1]
            ? studentsCountSplit[1] : studentsCountSplit[0]],
      },
    },
    group: ['lesson_students.lesson_id'],
    raw: true,
  }).then((result) => result.map((lesson) => lesson.lesson_id));

  const lessonsAll = await lessons.findAll({
    include: [
      {
        model: teachers,
        where: {
          id: { [Op.in]: teacherIds?.split(',') || await teacherAllIds },
        },
      },
      { model: students },
    ],
    where: {
      id: { [Op.in]: await lessonInCount },
      status: status || { [Op.ne]: null },
      date: {
        [Op.between]:
          [new Date(splitDate[0]), splitDate[1] ? new Date(splitDate[1]) : new Date(splitDate[0])],
      },
    },

    attributes: [
      'id', 'title', 'date', 'status',
      [db.literal(`(
        SELECT COUNT(visit)
        FROM lesson_students AS lesson_students
        WHERE
            lesson_students.visit = true
            AND
            lesson_id=lessons.id
        GROUP BY lesson_students.lesson_id
      )`),
      'visitCount'],
    ],
    limit: lessonsPerPage,
    offset: lessonsPerPage * (page - 1),
    order: [['id', 'ASC']],
  });
  res.setHeader('Content-Type', ' application/json');
  return res.send(lessonsAll);
};

module.exports = getInfo;
