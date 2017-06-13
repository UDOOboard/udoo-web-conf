var isIoTServiceRunning;
var token = '';

var socket = io();

$(document).ready(function () {
    $('#toggle-iot').on('switchChange.bootstrapSwitch', function (event, state) {
        onButtonIoTServiceClick(event)
    });
    $('#btn-iot-install').on('click', onButtonIoTServiceInstallClick);
    $('#iot-start-login').on('click', onIotStartLoginClick);
    $('#code-form').on('submit', onSaveCodeSubmit);
    $('#btn-log-collapse').on('click', collapseBox);
    initIoTPage();
    initIoTSocket();

});

function collapseBox() {
    $('#log-collapse').hasClass('in') ? $('#log-collapse').removeClass('in') : $('#log-collapse').addClass('in');
}

function initIoTSocket() {
    setTimeout(function () {
        socket.emit('iot-read-log', {enable: true});
        socket.emit('getnetworkstatus');
    }, 2000);
}

socket.on('iot-log', function (msg) {
    //console.log(msg);
    $('#log-iot').append(msg.data + '<br>');
    var textarea = document.getElementById('log-iot');
    textarea.scrollTop = textarea.scrollHeight;
});

socket.on('online', function(msg){
    if(msg === 'YES'){
        $('#internet-panel').removeClass('panel-yellow');
        $('#internet-panel').addClass('panel-green');
        $('#internet-alert').addClass('hidden');
        $('#internet-icon').removeClass('fa-warning');
        $('#internet-icon').addClass('fa-check');
        $('#internet-text').html('<b>CONNECTED</b>');

    }else{
        $('#internet-panel').removeClass('panel-green');
        $('#internet-panel').addClass('panel-yellow');
        $('#internet-alert').removeClass('hidden');
        $('#internet-icon').removeClass('fa-check');
        $('#internet-icon').addClass('fa-warning');
        $('#internet-text').html('<b>NO INTERNET CONNECTION DETECTED.</b>');
    }

});

function onIotStartLoginClick() {

    var url = URL_PATH + "/board-login/" + token;
    window.open(url);
   // $('#code-panel').removeClass('hidden');
    $('#code-panel').modal('show');
    $('#register-alert').addClass('hidden');
    $('#iot-external-link').attr('target', '_blank');
    $('#iot-external-link').attr('href', url);

}

function getTokenFromServer() {
    $.ajax({
        type: "GET",
        url: "/board/info",
        success: function (response) {
            console.log(response);
            $.ajax({
                type: "POST",
                data: {
                    boardId: response.boardId,
                    macAddress: response.macAddress,
                    hostname: response.hostname,
                    boardType: response.boardType
                },
                url: URL_PATH + '/board-login/pre-auth',
                success: function (response) {
                    token = response.token;
                }
            });
        }
    });

}

function onSaveCodeSubmit(e) {
    e.preventDefault();
    var code = $("#codes").val();
    $.ajax({
        type: "get",
        url: '/settings/iot/redis/' + code,
        success: function (response) {
            if (!response.err) {
                $('#code-panel').modal('hide');
                //codePanel.addClass("hidden");
                setIoTServiceCommand('start');
                retryStatus();
            } else {
                alert("Error: response getGrantCode not saved");
            }
        }
    });
}

function onButtonIoTServiceClick(e) {
    e.preventDefault();
    setIoTServiceCommand(isIoTServiceRunning ? "stop" : "start");
}

function onButtonIoTServiceInstallClick(e) {
    e.preventDefault();
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.loaded').addClass("hidden");
    $('#waitDialog div.error').addClass("hidden");
    $('#waitDialog').modal('show');

    $.ajax({
        type: "GET",
        url: '/settings/iot/install',
        success: function (response) {
            $('#waitDialog div.loading').addClass("hidden");
            if (response.status) {
                $('#waitDialog div.loaded').removeClass("hidden");
                $('#btn-iot-install').addClass('hidden');
                $('#toggle-iot-div').removeClass('hidden');
                setStateIoTPage(response.service);
            } else {
                $('#waitDialog div.error').html(response.message).removeClass("hidden");
            }
        }
    });

}

function setIoTServiceCommand(command) {
    $.ajax({
        type: "GET",
        url: '/settings/iot/service/' + command,
        success: function (response) {
            if (!response.err) {
                setStateIoTPage(response.service);
            } else {
                alert("Error: response getGrantCode not saved");
            }
        }
    });
}

function initIoTPage() {
    $.ajax({
        type: "GET",
        url: '/settings/iot/service/status',
        success: function (response) {
            if (!response.err) {
                setStateIoTPage(response.service);
            } else {
                isIoTServiceRunning = false;
                alert("Error: response getGrantCode not saved");
            }
        }
    });
}

function setStateIoTPage(iotState) {
    if (iotState) {
        if (iotState.started) {
            if (iotState.state.init) {
                retryStatus();
                showInit();
            }
            else if (iotState.state.wait) {
                getTokenFromServer();
                showWait();
            } else {
                showOn();
            }
        } else {
            if (!iotState.installed) {
                $('#btn-iot-install').removeClass('hidden');
                $('#toggle-iot-div').addClass('hidden');
            }
            showStop();
        }
    } else {

        showStop();
    }
}

function showInit() {
    isIoTServiceRunning = true;
    $('#toggle-iot').bootstrapSwitch('state', true, true);
    $('#btn-iot-install').addClass('hidden');
    $('#toggle-iot-div').removeClass('hidden');
    $('#iot-status-panel').removeClass('hidden');
    $('#code-panel').addClass("hidden");
    $('#service-status').text('Connecting...');
    $('#gateway-status').addClass('panel-yellow');
    $('#gateway-status').removeClass('panel-green panel-gray');
}

function showStop() {
    isIoTServiceRunning = false;
    $('#toggle-iot').bootstrapSwitch('state', false, true);
    $('#service-status').text('Offline');
    $('#iot-status-panel').removeClass('hidden');
    $('#gateway-status').removeClass('panel-green panel-yellow');
    $('#gateway-status').addClass('panel-gray');
    $('#register-done-alert').addClass('hidden');

}

function showOn() {
    isIoTServiceRunning = true;
    $('#code-panel').addClass("hidden");
    $('#toggle-iot').bootstrapSwitch('state', true, true);
    $('#service-status').text('Online');
    $('#gateway-status').addClass('panel-green');
    $('#gateway-status').removeClass('panel-yellow panel-gray');
    $('#register-done-alert').removeClass('hidden');
}

function showWait() {
    isIoTServiceRunning = true;
    $('#register-alert').removeClass('hidden');
    $('#toggle-iot').bootstrapSwitch('state', false, true);
    $('#service-status').text('Offline');
    $('#gateway-status').removeClass('panel-green panel-yellow');
    $('#gateway-status').addClass('panel-gray');

}


function retryStatus() {
    setTimeout(function () {
        setIoTServiceCommand('status');
    }, 5000);
}


