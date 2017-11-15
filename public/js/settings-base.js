$(function() {

    $("#change-root").on("click", function() {
        changePassword("root");
    });
    $("#change-udooer").on("click", function() {
        changePassword("udooer");
    });

    $("#change-hostname").on("click", function() {
        changeHostname();
    });


    $("form.hostname").on("submit", function() {
        var patt = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm;
        var isvalid = patt.test($("input[name=hostname]").val());
        
        if (!isvalid) {
            showMessage("The hostname provided is not valid!");
            return false;
        }
    });


});

function changePassword(username) {
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.done-message').addClass("hidden");
    $('#waitDialog div.modal-footer').addClass("hidden");
    $('#waitDialog').modal('show');

    var password  = $("[name=password_"+username+"]").val(),
        password2 = $("[name=password2_"+username+"]").val();

    if (!password || !password2) {
        showMessage("The password cannot be empty!");
        return false;
    }

    if (hasWhiteSpace(password)) {
        showMessage("The password cannot contain spaces!");
        return false;
    }

    if (password != password2) {
        showMessage("The two passwords do not match!");
        return false;
    }

    $.ajax({
        type: "POST",
        url: '/settings/change-password/',
        data: {
            username: username,
            password: password
        },
        success: function(response) {
            if (response.success) {
                showMessage("Password changed successfully.");
            } else {
                showMessage("Cannot change password!");
            }
        },
        error: function() {
            showMessage("Cannot change password!");
        }
    });
}

function showMessage(errorText) {
    $('#waitDialog div.loading').addClass("hidden");
    $('#waitDialog div.modal-footer').removeClass("hidden");
    $('#waitDialog div.done-message').html(errorText).removeClass("hidden");
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}

function changeHostname() {
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.done-message').addClass("hidden");
    $('#waitDialog div.modal-footer').addClass("hidden");
    $('#waitDialog').modal('show');

    var patt = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm,
        hostname = $("input[name=hostname]").val(),
        isValid = patt.test();

    if (!isValid) {
        showMessage("The hostname provided is not valid!");
        return false;
    }

    $.ajax({
        type: "POST",
        url: '/settings/set-hostname/',
        data: {
            hostname: hostname
        },
        success: function(response) {
            if (response.success) {
                showMessage("Board name changed successfully.<br>Reboot your board to reflect the change.");
            } else {
                showMessage("Cannot change board name!");
            }
        },
        error: function() {
            showMessage("Cannot change board name!");
        }
    });
}
