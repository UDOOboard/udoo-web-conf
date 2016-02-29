var languagesLoaded = null,
    firstTimeLoaded = false;

function autoSelectCountryOnLoad() {
    if (!firstTimeLoaded) {
        $('#edit-site-default-language').val(window.lastLanguage);
        firstTimeLoaded = true;
    }
}

$(document).ready(function() {
    $('#timezone-image').timezonePicker({
        target: '#edit-date-default-timezone',
        countryTarget: '#edit-site-default-country'
    });
    
    $('#timezone-detect').click(function() {
        $('#timezone-image').timezonePicker('detectLocation');
    });
    
    $("#edit-site-default-country").on("autochange", function() {
        var newCountry = $("#edit-site-default-country").val();
        if (languagesLoaded == newCountry) {
            return;
        } else {
            languagesLoaded = newCountry;
        }
        
        if (newCountry == 'IT') {
            $('#edit-site-default-language').html("<option value=\"it\">Italian</option>");
            autoSelectCountryOnLoad();
        } else {
            $.ajax({
                type: "GET",
                url: '/settings/regional-languages/' + newCountry,
                success: function(response) {
                    if (response.success) {
                        $('#edit-site-default-language').empty();
                        
                        for (var i=0; i<response.languages.length; i++) {
                            var l = response.languages[i],
                                html = "<option value=\"" + l.iso639_1 + "\">" + l.name[0] + "</option>";
                            $("#edit-site-default-language").append(html);
                        }
                        
                        autoSelectCountryOnLoad();
                    } else {
                        alert("Error: cannot get languages spoken in " + newCountry);
                    }
                }
            });
        }
    });
    
    $("form").on("submit", function() {
        var timezone = $("select[name=timezone]").val();
        var country = $("select[name=country]").val();
        var language = $("select[name=language]").val();
        
        if (!timezone || !country || !language) {
            $('#regionalError').modal('show');
            return false;
        }
    });
});