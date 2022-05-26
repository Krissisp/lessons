const express = require('express');
const addLessons = require('../controller/addLessons');
const getInfo = require('../controller/getInfo');
const validateSchema = require('../validation/getInfo');
const validateSchemaAddLessons = require('../validation/addLessons');

const router = express.Router();

router.get('/', validateSchema, getInfo);
router.post('/lessons', validateSchemaAddLessons, addLessons);
module.exports = router;
