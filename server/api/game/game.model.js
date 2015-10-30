'use strict';

var constants = require('../../logic/constants'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  board: [Number],
  status: {
  	id: {
  		type: Number,
  		default: constants.statusIDProgress
  	},
  	message: String,
  	winningPositions: [Number]
  }
});

GameSchema.pre("save",function(next) {
  // initialize board cells array	
  if ( !this.board || this.board.length === 0 ) {
    this.board = [];

    for (var i = constants.boardSize*constants.boardSize - 1; i >= 0; i--) {
    	this.board.push(-1);
    };
  }

  next();
});

module.exports = mongoose.model('Game', GameSchema);