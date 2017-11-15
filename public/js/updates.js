$(function() {
    $.ajax({
        type: "GET",
        url: '/updates/dist-upgrade/'
    });

    var height = $("#leftsidebar").height()-170;
    $("#terminal").height(height);
    $(".terminal-preloader").height(height);

    setTimeout(function() {
        $("#terminal").attr("src", "http://" + document.location.hostname + ":57126");
        $("#terminal").removeClass('hidden');
        $(".terminal-preloader").addClass('hidden');

        var ws = new WebSocket("ws://" + document.location.hostname + ":57126/ws");
        ws.onclose = function() {
            $.ajax({
                type: "GET",
                url: '/updates/installed/'
            });
            $('iframe').hide();
            $('iframe').parent().append("<p>Updates installed successfully!</p>");
        };
    }, 2000);
});
