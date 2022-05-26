const Sequelize = require('sequelize');
const db = require('../db');

const students = db.define('students', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
});
const teachers = db.define('teachers', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});
module.exports = teachers;

const lessons = db.define('lessons', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  date: {
    type: Sequelize.DATE,
  },
});
const lesson_students = db.define('lesson_students', {
  lesson_id: {
    type: Sequelize.INTEGER,
    references: {
      model: lessons,
      key: 'id',
    },
  },
  student_id: {
    type: Sequelize.INTEGER,
    references: {
      model: students,
      key: 'id',
    },
  },
  visit: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

const lesson_teachers = db.define('lesson_teachers', {
  lesson_id: {
    type: Sequelize.INTEGER,
    references: {
      model: lessons,
      key: 'id',
    },
  },
  teacher_id: {
    type: Sequelize.INTEGER,
    references: {
      model: teachers,
      key: 'id',
    },
  },
});

students.belongsToMany(lessons, {
  through: lesson_students,
  foreignKey: 'student_id',
});
lessons.belongsToMany(students, {
  through: lesson_students,
  foreignKey: 'lesson_id',
});
teachers.belongsToMany(lessons, {
  through: lesson_teachers,
  foreignKey: 'teacher_id',
});
lessons.belongsToMany(teachers, {
  through: lesson_teachers,
  foreignKey: 'lesson_id',
});

module.exports = {
  lessons, teachers, lesson_students, lesson_teachers, students,
};
