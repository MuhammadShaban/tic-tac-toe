(function(module) {
    var gameService = function(httpHelperService) {
        var createNewGame = function() {
            var url = "api/game";
            return httpHelperService.makeHttpPostRequest(url);
        }

        var getGameInfo = function(id) {
            var url = "api/game/" + id;
            return httpHelperService.makeHttpGetRequest(url);
        }

        var makeHumanMove = function(gameID, cellID) {
            var url = "api/game/" + gameID + "/move/";
            var data = {
                playerID: 1,
                cellID: parseInt(cellID)
            };

            return httpHelperService.makeHttpPostRequest(url, data);
        }

        var makeComputerMove = function(gameID) {
            var url = "api/game/" + gameID + "/move/";
            var data = {
                playerID: 2
            };

            return httpHelperService.makeHttpPostRequest(url, data);
        }

        return {
            createNewGame: createNewGame,
            getGameInfo: getGameInfo,
            makeHumanMove: makeHumanMove,
            makeComputerMove: makeComputerMove
        }
    };

    module.factory("gameService", gameService);

})(angular.module("tic-tac-toe"));