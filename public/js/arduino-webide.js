$(function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.session.setMode("ace/mode/c_cpp");
    editor.setOptions({
        fontSize: "13pt"
    });

    $("#upload-ide").on("click", function() {
        $('#waitDialog div.loading').removeClass("hidden");
        $('#waitDialog div.loaded').addClass("hidden");
        $('#waitDialog div.error').addClass("hidden");
        $('#waitDialog div.modal-footer').addClass("hidden");
        $('#waitDialog').modal('show');

        $.ajax({
            type: "POST",
            url: '/arduino/compilesketch/',
            data: {
                sketch: ace.edit("editor").getValue().replace(/[^\040-\176\200-\377]/gi, "\n")
            },
            success: function(response) {
                $('#waitDialog div.loading').addClass("hidden");
                $('#waitDialog div.modal-footer').removeClass("hidden");
                if (response.success) {
                    $('#waitDialog div.loaded').removeClass("hidden");
                } else {
                    $('#waitDialog div.error').html(response.message || "Cannot flash sketch!").removeClass("hidden");
                }
            }
        });
    });
});
