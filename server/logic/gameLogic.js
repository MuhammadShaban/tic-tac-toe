'use strict';
var constants = require('./constants');

var winningCombos = [
	[ 1, 2, 3 ], 
    [ 4, 5, 6 ], 
    [ 7, 8, 9 ],
    [ 1, 5, 9 ],
    [ 3, 5, 7 ],
    [ 1, 4, 7 ],
    [ 2, 5, 8 ],
    [ 3, 6, 9 ]
];

exports.saveMove = function(game, playerID, cellID, saveCallback) {
	game.board[cellID - 1] = playerID;
	game.markModified('board');

	game.status = getStatus(game.board);

    game.save(saveCallback);
}

exports.getNextComputerMove = function(game) {
	var nextMovePosition = findAboutToWinPosition(game.board, constants.playerIDComputer);

	// check if there is a position that brings victory to the computer
    if (nextMovePosition === constants.cellContentNotSet)
        nextMovePosition = findAboutToWinPosition(game.board, constants.playerIDHuman);

	// check if there is a position that brings victory to the human player
    if (nextMovePosition === constants.cellContentNotSet)
        nextMovePosition = getAnyAvailableCellIndex(game.board);

    return nextMovePosition + 1;
}

function getAnyAvailableCellIndex(board) {
	var moveCellIndex = -1;

    for (var i = 0; i < board.length; i++)
    {
        if (board[i] === constants.cellContentNotSet)
        {
            moveCellIndex = i;
            break;
        }
    }

    return moveCellIndex;
}

function findAboutToWinPosition(board, playerID) {
    var aboutToWinIndex = -1;
    for (var i = 0; i < winningCombos.length; i++)
    {
        var cell1Content = board[winningCombos[i][0] - 1];
        var cell2Content = board[winningCombos[i][1] - 1];
        var cell3Content = board[winningCombos[i][2] - 1];

        var winningComboHasUnusedCell = cell1Content === constants.cellContentNotSet
                                        || cell2Content === constants.cellContentNotSet
                                        || cell3Content === constants.cellContentNotSet;
        if (!winningComboHasUnusedCell)
            continue;

        var hasAboutToWinLocation = 
            (cell1Content === cell2Content && cell1Content === playerID) ||
            (cell2Content === cell3Content && cell2Content === playerID) ||
            (cell1Content === cell3Content && cell1Content === playerID);

        if (!hasAboutToWinLocation)
            continue;

        var aboutToWinIndexes = [
            winningCombos[i][0] - 1,
            winningCombos[i][1] - 1,
            winningCombos[i][2] - 1
        ];

        aboutToWinIndex = getUnusedCellIndex(board, aboutToWinIndexes);
        break;
    }

    return aboutToWinIndex;
}

function getStatus(board) {
	var gameStatus =  { 
			id: constants.statusIDProgress 
		};

	var winningResult = findWinner(board);
	if (winningResult && winningResult.playerID === constants.playerIDHuman) {
		gameStatus = { 
			id: constants.statusIDHumanWon,
			message: "Human is the winner!!",
			winningPositions: winningResult.positions
		}
	}
	else if (winningResult && winningResult.playerID === constants.playerIDComputer) {
		gameStatus = { 
			id: constants.statusIDComputerWon,
			message: "Computer is the winner!!",
			winningPositions: winningResult.positions
		}
	}
	else if (!hasEmptyCells(board)) {
		gameStatus = { 
			id: constants.statusIDTie,
			message: "It is a Tie. Try again later!!"
		}
	}

	return gameStatus;
}

function findWinner(board) {
    var winningResult = null;

    for (var i = 0; i < winningCombos.length; i++)
    {
        var cell1Content = board[winningCombos[i][0] - 1];
        var cell2Content = board[winningCombos[i][1] - 1];
        var cell3Content = board[winningCombos[i][2] - 1];

        var foundWinner = cell1Content === cell2Content
                          && cell2Content === cell3Content
                          && cell1Content !== constants.cellContentNotSet;

        if (foundWinner)
        {
            winningResult = {
            	playerID: board[winningCombos[i][0] - 1],
            	positions:  
	            [
	                winningCombos[i][0],
	                winningCombos[i][1],
	                winningCombos[i][2]
	            ]};
            break;
        }
    }

    return winningResult;
}

function getUnusedCellIndex(board, cellIndexes)
{
    var unusedCellIndex = -1;
    for (var i = 0; i < cellIndexes.length; i++)
    {
        if (board[cellIndexes[i]] === constants.cellContentNotSet) 
        {
            unusedCellIndex = cellIndexes[i];
            break;
        }
    }

    return unusedCellIndex;
}

function hasEmptyCells(board) {
	var hasEmptyCells = false;
    for (var i = 0; i < board.length; i++)
    {
        if (board[i] === constants.cellContentNotSet)
        {
            hasEmptyCells = true;
            break;
        }
    }

    return hasEmptyCells;
}

