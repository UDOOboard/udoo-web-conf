$(function() {
    $("#iotlogin").on("click", login);
    $("#setIoTserver").on("click", showIoTserverDialog);
    $("#change-iotserver").on("click", saveIoTserver);
});


function login() {
    showDialog();
    $.ajax({
        type: "POST",
        url: '/iot/register/',
        data: {
            username: $("[name=username]").val(),
            password: $("[name=password]").val()
        },
        success: function(response) {
            if (response.success) {
                setTimeout(function() {
                    window.location.replace("/iot");
                }, 2000);
            } else {
                var message = response.message || "Cannot connect to UDOO IoT Cloud!";
                if (typeof message === 'object') {
                    message = "Error " + message.code;
                }
                showMessage(message);
            }
        },
        error: function(response) {
            var message = response.message || "Cannot connect to UDOO IoT Cloud!";
            if (typeof message === 'object') {
                message = "Error " + message.code;
            }
            showMessage(message);
        }
    });
}

function showMessage(errorText) {
    $('#waitDialog div.loading').addClass("hidden");
    $('#waitDialog div.modal-footer').removeClass("hidden");
    $('#waitDialog div.done-message').html(errorText).removeClass("hidden");
}

function showDialog(onCloseCallback) {
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.done-message').addClass("hidden");
    $('#waitDialog div.modal-footer').addClass("hidden");
    $('#waitDialog').modal('show');
}

function showIoTserverDialog() {
    $("#setServerDialog .form-line.focused").removeClass("focused");
    $('#setServerDialog').modal('show');
}

function showMessage2(errorText) {
    $('#waitDialog2 div.loading').addClass("hidden");
    $('#waitDialog2 div.modal-footer').removeClass("hidden");
    $('#waitDialog2 div.done-message').html(errorText).removeClass("hidden");
}

function showDialog2(onCloseCallback) {
    $('#waitDialog2 div.loading').removeClass("hidden");
    $('#waitDialog2 div.done-message').addClass("hidden");
    $('#waitDialog2 div.modal-footer').addClass("hidden");
    $('#waitDialog2').modal('show');
}

function saveIoTserver() {
    $('#setServerDialog').modal('hide');

    var formData = {
        ip: $("#iotserver_ip").val(),
        port: $("#iotserver_port").val(),
        protocol: $("#iotserver_protocol").val(),
    };

    var isValidIpAddressRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
    var isValidHostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");
    if (isValidIpAddressRegex.test(formData.ip) === false && isValidHostnameRegex.test(formData.ip) === false) {
        showDialog2();
        showMessage2("Invalid hostname!");
        return;
    }

    var isNumber = new RegExp('^[0-9]+$');
    if (isNumber.test(formData.port) === false) {
        showDialog2();
        showMessage2("Invalid port number!");
        return;
    }

    showDialog();
    $.ajax({
        type: "POST",
        url: '/iot/set-server/',
        data: formData,
        success: function(response) {
            if (response.success) {
                location.reload();
            } else {
                showMessage(response.message || "Cannot save settings!");
            }
        },
        error: function(response) {
            showMessage(response.message || "Cannot save settings!");
        }
    });
}