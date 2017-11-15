$(function() {
    $("#iotlogout").on("click", logout);
});


function logout() {
    showDialog();
    $.ajax({
        type: "POST",
        url: '/iot/unregister/',
        data: {
            username: $("[name=username]").val(),
            password: $("[name=password]").val()
        },
        success: function(response) {
            if (response.success) {
                window.location.replace("/iot");
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

function showDialog() {
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.done-message').addClass("hidden");
    $('#waitDialog div.modal-footer').addClass("hidden");
    $('#waitDialog').modal('show');
}
