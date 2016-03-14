$(function() {
    $("form.webport").on("submit", function() {
        if ($("form.webport select").val() == "-1") {
            alert("To re-enable this tool, remove /etc/init/udoo-web-conf.override");
        } else {
            alert("Please reboot your UDOO board to apply the changes.");
        }
    });
});
