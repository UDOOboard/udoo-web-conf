$(function() {
    $("#installservice").on("click", function() {
        $('.iotservice-installer').addClass('hidden');
        $('.iotservice-preloader').removeClass('hidden');

        $.ajax({
            type: "GET",
            url: '/iot/service-install'
        });

        var height = $("#leftsidebar").height()-300;
        $("#terminal").height(height);

        setTimeout(function() {
            $("#terminal").attr("src", "http://" + document.location.hostname + ":57128");
            $("#terminal").removeClass('hidden');
            $(".iotservice-preloader").addClass('hidden');

            var ws = new WebSocket("ws://" + document.location.hostname + ":57128/ws");
            ws.onclose = function() {
                window.location.href = document.location.origin + "/iot";
            };
        }, 2000);
    });
});

