/**
 * Created by alessio.calafiore on 14/07/2015.
 */
(function(){
    var app = angular.module('udooCfgApp', [ 'udooCfgControllers', 'udooCfgDirectives', 'mgo-angular-wizard' ]);


/*    app.factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });*/


})();