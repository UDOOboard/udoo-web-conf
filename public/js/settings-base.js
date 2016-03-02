$(function() {

    $("form.hostname").on("submit", function() {
        var patt = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm;
        var isvalid = patt.test($("input[name=hostname]").val());
        
        if (!isvalid) {
            showError("The hostname provided is not valid!");
            return false;
        }
    });
    
    $("form.udooer-user").on("submit", checkForm);
    $("form.root-user").on("submit", checkForm);
});

function checkForm() {
    var password  = $(this).find("[name=password]").val(),
        password2 = $(this).find("[name=password2]").val();
    
    if (!password || !password2) {
        showError("The password cannot be empty!");
        return false;
    }
    
    if (hasWhiteSpace(password)) {
        showError("The password cannot contain spaces!");
        return false;
    }
    
    if (password != password2) {
        showError("The two passwords do not match!");
        return false;
    }
}

function showError(errorText) {
    $('#genericError .modal-body').html(errorText);
    $('#genericError').modal('show');
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}
