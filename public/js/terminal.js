$(function() {
    $.ajax({
        type: "GET",
        url: '/terminal/start'
    });

    var height = $("#leftsidebar").height()-170;
    $("#terminal").height(height);
    $(".terminal-preloader").height(height);

    setTimeout(function() {
        $("#terminal").attr("src", "http://" + document.location.hostname + ":57125");
        $("#terminal").removeClass('hidden');
        $(".terminal-preloader").addClass('hidden');
    }, 2000);

});
