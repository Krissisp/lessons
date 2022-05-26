const sequelize = require('../db');
const createLesson = require('../utils/createLessons');
const validate = require('../utils/validationData');

const addLessons = async (req, res) => {
  validate(req, res);
  const arrayData = [];
  const {
    teacherIds, title, firstDate, days, lastDate,
  } = req.body;
  let { lessonCount } = req.body;
  if (lessonCount && lastDate) {
    return res.status(400).json({ message: 'Укажите один из параметров (lessonCount или lastDate)' });
  }
  // поиск ближайшего дня следующего занятия от firstDay
  let nearestDayOfTheFirstWeek = days[0];
  const startDate = new Date(firstDate);
  // день недели даты startDay
  const startDayOfTheWeek = startDate.getDay();
  const msInOneDay = 1000 * 60 * 60 * 24;
  for (const day of days.sort()) {
    if (day >= startDayOfTheWeek) {
      // первое совпадение - ближайший день недели для занятия
      nearestDayOfTheFirstWeek = day;
      break;
    }
  }
  // дни недели занятий, которые будут на первой неделе от firstDay
  const daysLessonsOfTheNearestWeek = days.sort().slice(days.indexOf(nearestDayOfTheFirstWeek));
  // количество занятий, которые будут на первой неделе от firstDay
  const countOfLessonsInTheFirstWeek = nearestDayOfTheFirstWeek < startDayOfTheWeek ? 0
    : daysLessonsOfTheNearestWeek.length;
  if (lastDate && !lessonCount) {
    const endDate = new Date(lastDate);
    // количество полных недель между firstDay и lastDate
    const countOfFullWeeks = Math.floor(((endDate - startDate) / msInOneDay) / 7);
    // расчет числа занятий с учетом ограничения по количеству
    lessonCount = (countOfFullWeeks * days.length + countOfLessonsInTheFirstWeek) > 300
      ? 300 : lessonCount;
  }

  if (!lastDate && lessonCount) {
    // здесь предварительный расчет количества занятий с ограничением на год
    const endDate = new Date(
      startDate.getFullYear() + 1,
      startDate.getMonth(),
      startDate.getDate(),
    );

    const countOfFullWeeks = Math.floor(((endDate - startDate) / msInOneDay) / 7);
    const estimatedLessonCount = (countOfFullWeeks * days.length + countOfLessonsInTheFirstWeek);
    lessonCount = estimatedLessonCount < lessonCount ? estimatedLessonCount : lessonCount;
  }
  // вычитание количества занятий на ближайшей неделе от общего
  // количества для расчета целого числа повтора массива days
  lessonCount = nearestDayOfTheFirstWeek >= startDayOfTheWeek
    ? lessonCount - daysLessonsOfTheNearestWeek.length
    : lessonCount;

  let currentLastDate;

  // занятия на ближайшей неделе
  if (daysLessonsOfTheNearestWeek.length !== 0) {
    for (const dayOfTheWeek of daysLessonsOfTheNearestWeek) {
      const diffDate = dayOfTheWeek - startDayOfTheWeek;
      currentLastDate = new Date(
        Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + diffDate,
        ),
      );
      createLesson(arrayData, title, currentLastDate, teacherIds);
    }
  }
  // число повторов занятий по каждому дню недели
  const countRepeat = Math.floor(lessonCount / days.length);
  const startPoint = currentLastDate;

  for (const day of days) {
    if (countRepeat !== 0) {
      currentLastDate = new Date(
        Date.UTC(
          startPoint.getFullYear(),
          startPoint.getMonth(),
          startPoint.getDate()
        + (7 - (startPoint.getDay() - day)),
        ),
      );
      createLesson(arrayData, title, currentLastDate, teacherIds);
    }
    let count = 1;
    while (count < countRepeat) {
      currentLastDate = new Date(
        Date.UTC(
          currentLastDate.getFullYear(),
          currentLastDate.getMonth(),
          currentLastDate.getDate() + 7,
        ),
      );
      createLesson(arrayData, title, currentLastDate, teacherIds);
      count += 1;
    }
  }

  const daysOfLessonsInTheLastWeek = lessonCount % days.length;

  if (daysOfLessonsInTheLastWeek !== 0) {
    for (let i = 0; i < daysOfLessonsInTheLastWeek; i += 1) {
      currentLastDate = new Date(
        Date.UTC(
          currentLastDate.getFullYear(),
          currentLastDate.getMonth(),
          currentLastDate.getDate()
        + (7 - (currentLastDate.getDay() - days[i])),
        ),
      );
      createLesson(arrayData, title, currentLastDate, teacherIds);
    }
  }

  const result1 = await sequelize.transaction(() => Promise.all(arrayData));
  res.setHeader('Content-Type', ' application/json');
  return res.json(result1);
};

module.exports = addLessons;
