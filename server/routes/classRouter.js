const express = require('express');
const mongoose = require('mongoose');

const classRouter = express.Router();
const classController = require('../controllers/classController')();

classRouter.get('/', classController.getClass );
classRouter.post('/', classController.postClass );

module.exports = classRouter;