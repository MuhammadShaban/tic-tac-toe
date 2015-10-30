'use strict';
var Game = require('./game.model'),
	gameLogic = require('../../logic/gameLogic'),
	constants = require('../../logic/constants');

exports.useID = function(req, res, next) {
	Game.findById(req.params.id, function (err, game) {
		if(err) { return handleError(res, err); }
		if(!game) { return res.status(404).send('Not Found'); }

		req.game = game;
		next();
	});
}

// Get an existing game information
exports.get = function(req, res) {
    return res.json(req.game);
};

// Creates a new game in the DB.
exports.create = function(req, res) {
  Game.create(req.body, function(err, game) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(game);
  });
};

// Makes game move
exports.makeMove = function(req, res) {
	if (!req.body.playerID || req.body.playerID <= 0) {
		return handleError(res, "Invalid playerID");
	}

	var playerID = req.body.playerID,
		game = req.game;

	if (playerID === constants.playerIDHuman) {
		var nextMove = req.body.cellID;
		gameLogic.saveMove(
			game, playerID, nextMove,
			function (err) {
		    	if (err) { return handleError(res, err); }
		    	return res.status(201).json(nextMove);
		    }
		);
	}
	else if (playerID === constants.playerIDComputer) {
		var nextMove = gameLogic.getNextComputerMove(req.game);
		gameLogic.saveMove(
			game, playerID, nextMove,
			function (err) {
		    	if (err) { return handleError(res, err); }
		    	return res.status(201).json(nextMove);
		    }
		);
	}

};

function handleError(res, err) {
  return res.status(500).send(err);
}