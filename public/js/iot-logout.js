$(function() {
    $("form#sign_out").on("submit", function() {
        logout();
        return false;
    });
    $("#iotlogout").on("click", logout);
});


function logout() {
    showDialog();
    $.ajax({
        type: "POST",
        url: '/iot/unregister/',
        data: {
            username: $("[name=udooiot_username]").val(),
            password: $("[name=udooiot_password]").val()
        },
        success: function(response) {
            if (response.success) {
                window.location.replace("/iot");
            } else {
                var message = "";
                if (typeof response.message === 'object') {
                    if (response.message.name) message += response.message.name;
                    if (response.message.codeName) message += " " + response.message.codeName;
                    if (response.message.code) message += " (" + response.message.code + ")";
                    if (response.message.errmsg) message += ": " + response.message.errmsg;
                } else {
                    message = response.message || "Cannot connect to UDOO IoT Cloud!";
                }
                showMessage(message);
            }
        },
        error: function(response) {
            var message = response.message || "Cannot connect to UDOO IoT Cloud!";
            showMessage(message);
        }
    });
}

function showMessage(errorText) {
    $('#waitDialog div.loading').addClass("hidden");
    $('#waitDialog div.modal-footer').removeClass("hidden");
    $('#waitDialog div.done-message').html(errorText).removeClass("hidden");
}

function showDialog() {
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.done-message').addClass("hidden");
    $('#waitDialog div.modal-footer').addClass("hidden");
    $('#waitDialog').modal('show');
}
