var languagesLoaded = null,
    firstTimeLoaded = false;

function autoSelectCountryOnLoad() {
    if (!firstTimeLoaded) {
        $('#edit-site-default-language').val(window.lastLanguage);
        firstTimeLoaded = true;
    }
}

$(function() {
    $('#timezone-image').timezonePicker({
        target: '#edit-date-default-timezone',
        countryTarget: '#edit-site-default-country'
    });
    
    $('#timezone-detect').click(function() {
        $('#timezone-image').timezonePicker('detectLocation');
    });

    $("#save").click(function() {
        saveTimezone();
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
                                html = "<option value=\"" + l.code + "\">" + l.name + "</option>";
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
});

function saveTimezone() {
    var timezone = $("select[name=timezone]").val();
    var country = $("select[name=country]").val();
    var language = $("select[name=language]").val();

    if (!timezone || !country || !language) {
        $('#tzSettings div.loading').addClass("hidden");
        $('#tzSettings div.done-message').html("Please select a country and a time zone").removeClass("hidden");
        $('#tzSettings div.modal-footer').removeClass("hidden");
        $('#tzSettings').modal('show');
        return false;
    }

    $('#tzSettings div.loading').removeClass("hidden");
    $('#tzSettings div.done-message').addClass("hidden");
    $('#tzSettings div.modal-footer').addClass("hidden");
    $('#tzSettings').modal('show');

    $.ajax({
        type: "POST",
        url: '/settings/regional-update/',
        data: {
            timezone: timezone,
            country: country,
            language: language
        },
        success: function(response) {
            if (response.success) {
                showMessage("Regional settings updated.");
            } else {
                showMessage("Cannot save regional settings!");
            }
        },
        error: function() {
            debugger;
            showMessage("Cannot save regional settings!");
        }
    });
}

function showMessage(errorText) {
    $('#tzSettings div.loading').addClass("hidden");
    $('#tzSettings div.modal-footer').removeClass("hidden");
    $('#tzSettings div.done-message').html(errorText).removeClass("hidden");
}
