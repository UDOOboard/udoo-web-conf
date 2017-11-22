$(function() {
    setInterval(function() {
        checkService();
    }, 2000);
});

function checkService() {
    $.ajax({
        type: "POST",
        url: '/iot/servicestatus/',
        success: function (response) {
            if (response && response.isavailable) {
                window.location.href = document.location.origin + "/iot";
            }
        }
    });
}