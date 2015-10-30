'use strict';

var express = require('express');
var controller = require('./game.controller');

var router = express.Router();

router
	.post('/', controller.create)
	.use('/:id', controller.useID)
	.get('/:id', controller.get)
	.post('/:id/move', controller.makeMove);

module.exports = router;