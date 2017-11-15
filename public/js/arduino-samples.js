$(function () {
    $("#fade").on("click", function() {
        flashSketch("Fade");
    });
    $("#blink").on("click", function() {
        flashSketch("Blink");
    });

    $.each(["example-blink", "example-fade"], function(index, id) {
        var editor = ace.edit(id);
        editor.setHighlightActiveLine(false);
        editor.setReadOnly(true);
        editor.setTheme("ace/theme/dawn");
        editor.session.setMode("ace/mode/c_cpp");
        editor.setOptions({
            fontSize: "13pt"
        });
    });
});

function flashSketch(sketch) {
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.loaded').addClass("hidden");
    $('#waitDialog div.error').addClass("hidden");
    $('#waitDialog div.modal-footer').addClass("hidden");
    $('#waitDialog').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#waitDialog').modal('show');

    $.ajax({
        type: "GET",
        url: '/arduino/uploadsketch/' + sketch,
        success: function(response) {
            $('#waitDialog div.loading').addClass("hidden");
            $('#waitDialog div.modal-footer').removeClass("hidden");
            if (response && response.success) {
                $('#waitDialog div.loaded').removeClass("hidden");
            } else {
                $('#waitDialog div.error').html(response.message || "Cannot flash sketch!").removeClass("hidden");
            }
        }
    });
}
