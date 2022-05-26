const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const router = require('./routes/lessons');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);

app.listen(3000);
module.exports = app;
