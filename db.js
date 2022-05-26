const cls = require('cls-hooked');

const namespace = cls.createNamespace('my-very-own-namespace');
const Sequelize = require('@sequelize/core');
require('dotenv').config();

Sequelize.useCLS(namespace);
const db = new Sequelize(process.env.URL, {
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
// db.sync();
module.exports = db;
