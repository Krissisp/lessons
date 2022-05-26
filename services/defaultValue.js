const { lessons } = require('../entities/entities');

async function getDefaultDate() {
  const firstDate = await lessons.findOne({
    attributes: ['date'],
    order: [['date', 'ASC']],
    raw: true,
  });
  const lastDate = await lessons.findOne({
    attributes: ['date'],
    order: [['date', 'DESC']],
    raw: true,
  });
  return `${firstDate.date},${lastDate.date}`;
}
module.exports = getDefaultDate;
