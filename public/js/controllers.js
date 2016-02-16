/**
 * Created by alessio.calafiore on 14/07/2015.
 */


(function(){
    var app = angular.module('udooCfgControllers', []);

    app.controller('MainController', [ '$http', '$window', /*'socket',*/ function($http, $window, WizardHandler /*,socket*/){
        var that = this;
        that.wifiPassword = "";
        that.selectedNetwork = {isProtected: false};
        that.originalKbLayout = { id: "us", name: "us"};
        that.originalHostname = "";
        that.timezone = "";

        $http.get('/date').success(function(data){
            that.dateData = data.dateData;
        });

        $http.get('/timezone').success(function(data){
            that.timezone = data.messaggio;
        });

        $http.get('/hostname').success(function(data){
            if (data.hostname[1]){
                //mostra eccezione a video
            }
            that.originalHostname = data.hostname[0];
            that.hostname = data.hostname[0];
        });

        $http.get('/keyboardlayouts').success(function(data){
            if (data.kblayouts[1]){
                //mostra eccezione a video
            }
            that.kblayouts = data.kblayouts[0];
            that.kblayoutsSplit = _.words(that.kblayouts);
            that.result = _.filter(that.kblayoutsSplit, function(item) {
                return (_.size(item) === 2 && !(/^\d+$/.test(item)));
            });

            var arr = [];
            var len = that.result.length;
            for (var i = 0; i < len; i++) {
                arr.push({
                    id: that.result[i],
                    name: that.result[i]
                });
            }

            that.kbData = {};
            that.kbData["availableOptions"] = arr;
            that.kbData["selectedOption"] = { id: "us", name: "us"};

        });

        $http.get('/wifiList').success(function(data){
            var msg = data.wifiListOutput[0];
            var arrWifiList = msg.split(/\r?\n/)
            //var wifiList = arrWifiList[0];


            that.finalList = [];

            for (var i = 1; i < arrWifiList.length - 1; i++){ //skip first and last lines
                var start_pos = arrWifiList[i].indexOf('\'') + 1;
                var end_pos = arrWifiList[i].lastIndexOf('\'');
                var networkName = arrWifiList[i].substring(start_pos,end_pos);
                var isProtected = false;
                if (arrWifiList[i].indexOf("WPA") > -1 || arrWifiList[i].indexOf("WEP") > -1) {
                    isProtected = true;
                }
                that.finalList.push({
                    networkName: networkName,
                    isProtected: isProtected,
                    isSelected: false
                });
            }

        });

        that.selectNetwork = function(network) {
            that.wifiPassword = "";
            for (var i = 0; i < that.finalList.length; i++){
                that.finalList[i].isSelected = false;
            }
            network.isSelected = true;
            that.selectedNetwork = network;
        };

        that.connectToNetwork = function() {

            $http.get('/hostname/' + that.hostname).success(function(data){
                console.log('new hostname: ' + that.hostname);
                console.log(data);
               if (typeof(data.hostname[1]) == 'undefined') {
                   console.log('Errore nel cambio hostname');
                   $window.alert('Unexpected error during hostname change. Please, try again.');
                   return;
               }
                else {
                   console.log('Cambio hostname ok');
                   $window.alert('Done! Settings saved');
               }
            });

            $http.get('/keyboardlayouts/' + that.kbData["selectedOption"].id).success(function(data){
                console.log('KbLayout ' + that.kbData["selectedOption"].id);
                console.log(data);
                if (typeof(data.kblayouts[1]) == 'undefined') {
                    console.log('Errore nel cambio kb layout');
                    //$window.alert('Unexpected error during keyboard layout change. Please, try again.');
                    return;
                }
                else {
                    console.log('Cambio kblayout ok');
                }
            });

            if (that.selectedNetwork.isProtected){
                $http.get('/connectWifi/' + that.selectedNetwork.networkName + '/' + that.wifiPassword).success(function(data){
                    if (typeof(data.wifiConnectionOutput[1]) == 'undefined'){ //Errore
                        console.log("NON Connesso con password")
                        $window.alert('Error during wifi connection. Wrong password?');
                    }
                    else{
                        console.log("Connesso con password");
                        //$window.alert('Wi-fi successfully configured');
                        that.finishedWizard();
                        //WizardHandler.wizard().finish();
                    }
                });
            } else {
                $http.get('/connectWifi/' + that.selectedNetwork.networkName).success(function(data){
                    if (typeof(data.wifiConnectionOutput[1]) == 'undefined'){ //Errore
                        console.log('NON Connesso senza pwd');
                        //$window.alert('Error during wifi connection.');
                    }
                    else{
                        console.log('Connesso senza pwd');
                        that.finishedWizard();
                        //WizardHandler.wizard().finish();
                    }
                });
            }
        };

        that.finishedWizard = function() {
            $window.location.href = '/';
        }


        //socket.emit('chat message', 'vaiiJdsijd');
    }]);
})();