(function (module) {

    var httpHelperService = function ($http, $q, $log) {
        var makeHttpGetRequest = function (url) {
            var deferred = $q.defer();
            $http.get(url)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });

            return deferred.promise;
        }

        var makeHttpPutRequest = function(url, data) {
            var deferred = $q.defer();

            $http.put(url, data)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });

            return deferred.promise;
        }
        
        var makeHttpPostRequest = function (url, data) {
            var deferred = $q.defer();

            $http.post(url, data)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });

            return deferred.promise;
        }

        var makeHttpDeleteRequest = function(url) {
            var deferred = $q.defer();

            $http.delete(url)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });

            return deferred.promise;
        }


        return {
            makeHttpGetRequest: makeHttpGetRequest,
            makeHttpPutRequest: makeHttpPutRequest,
            makeHttpPostRequest: makeHttpPostRequest,
            makeHttpDeleteRequest: makeHttpDeleteRequest
        };

    };

    module.factory("httpHelperService", httpHelperService);
})(angular.module("tic-tac-toe"));