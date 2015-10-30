(function(module) {
	var boardController = function($scope, $q, gameService) {
		'use strict';

        $scope.onCellClick = function(event) {
        	var scoreMessage, cell, cellID, gameID;

			var processHumanMove = function(cellID) {
	    		// mark human move
	    		styleCell(cellID, "crossed");

	    		// check status
	    		return gameService.getGameInfo(gameID);
	    	}

	    	var makeComputerMove = function() {
				// game is not over yet, make computer move
				return gameService.makeComputerMove(gameID);
	    	}

	    	var processComputerMove = function(cellID) {
	    		// mark computer move
	    		styleCell(cellID, "zeroed");

	    		// check status
	    		return gameService.getGameInfo(gameID);
	    	}

	    	var checkGameStatus = function(game) {
	    		var deferred = $q.defer();

				// check game status
				if (game.status.message)
				{
					showGameScore($scope, game.status);

					//exit out of the promises chain
					
					deferred.reject();
					return deferred.promise;
				}

				deferred.resolve(gameID)
				return deferred.promise;
	    	}

	        var isCellAvailable = function(cell) {
				return cell.className.indexOf('crossed') === -1 &&
					cell.className.indexOf('zeroed') === -1;
			}

			var isGameOver = function(scoreMessage) {
				return scoreMessage != null;
			}

        	cell = event.target;
			if (!isCellAvailable(cell) || isGameOver($scope.scoreMessage))
				return;

			gameID = $scope.gameID;
        	cellID = cell.attributes["data-id"].value;

            gameService
            	.makeHumanMove(gameID, cellID)
            	.then(processHumanMove)
            	.then(checkGameStatus)
            	.then(makeComputerMove)
            	.then(processComputerMove)
            	.then(checkGameStatus);
        }

        var showGameScore = function($scope, gameStatus) {
			$scope.scoreMessage = gameStatus.message;

			var winningPositions = gameStatus.winningPositions;
			if (winningPositions) {
        		markWinningPositions(winningPositions);
        	}
        }

        var styleCell = function(cellID, cellClass) {
			var d = document.getElementById('square' + cellID);
			d.className = d.className + " " + cellClass;
        }

        var markWinningPositions = function(winningPositions) {
        	for (var i = winningPositions.length - 1; i >= 0; i--) {
        		styleCell(winningPositions[i], "win")
        	};
        }

		$scope.gameID = "";
        $scope.startNewGame = function() {
        	gameService.createNewGame()
        	.then(function(game) {
        		$scope.gameID = game._id;
        	});
        }
	}

	module.controller("boardController", boardController);

})(angular.module("tic-tac-toe"));
