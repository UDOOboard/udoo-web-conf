$(function() {
    refreshWifiList();
    setInterval(refreshWifiList, 15000);

    $("#connect").on("click", function() {
        connectToNetwork();
    });
});

function refreshWifiList() {
    $('.wifi-spinner').removeClass("hidden");
    $.ajax({
        type: "GET",
        url: '/settings/wifi-networks',
        success: function(response) {
            if (response.success) {
                $('.wifi-spinner').addClass("hidden");
                $('.list-group.wifi').empty();

                if (response.wifi.length === 0) {
                    $('.list-group.wifi').html("No networks found!");
                    return;
                }
                
                for (var i=0; i<response.wifi.length; i++) {
                    var w = response.wifi[i];
                    var html = ['<a href="#" class="list-group-item" data-networkname="' + w.networkName + '" data-protected="' + w.isProtected + '">'];
                    if (w.isProtected) {
                        html.push('<span class="badge"><i style="font-size:13px;" class="material-icons">lock</i></i></span>');
                    }
                    html.push(generateSignalBars(w.signal)+' &nbsp; ' + w.networkName + '</a>');
                    $(".list-group.wifi").append(html.join(''));
                }
                
                $(".list-group.wifi .list-group-item").on("dblclick", onWifiClick);
            } else {
                alert("Error: cannot get wireless network list!");
            }
        }
    });
}

function onWifiClick() {
    var networkName = $(this).data('networkname');
    var isProtected = $(this).data('protected');
    
    $('#wifiPassword input[name=ssid]').val(networkName);
    $('#wifiPassword input[type=password]').val('');

    $('#wifiPassword div.loading').addClass("hidden");
    $('#wifiPassword div.done-message').addClass("hidden");
    $('#wifiPassword div.modal-footer').addClass("hidden");

    if (isProtected) {
        $('#wifiPassword div.pre-message').removeClass("hidden");
        $('#wifiPassword').modal('show');
    } else {
        $('#wifiPassword div.pre-message').addClass("hidden");
        $('#wifiPassword').modal('show');
        connectToNetwork();
    }
}

function connectToNetwork() {
    var ssid = $('#wifiPassword input[name=ssid]').val(),
        password = $('#wifiPassword input[type=password]').val();

    $('#wifiPassword div.pre-message').addClass("hidden");
    $('#wifiPassword div.loading').removeClass("hidden");

    $.ajax({
        type: "POST",
        url: '/settings/wifi-connect/',
        data: {
            ssid: ssid,
            password: password
        },
        success: function(response) {
            if (response.success) {
                showMessage("Your board is now connected to the "+ssid+" Wi-Fi network.");
            } else {
                showMessage("Cannot connect to the network!");
            }
        },
        error: function() {
            showMessage("Cannot connect to the network!");
        }
    });
}

function showMessage(errorText) {
    $('#wifiPassword div.loading').addClass("hidden");
    $('#wifiPassword div.modal-footer').removeClass("hidden");
    $('#wifiPassword div.done-message').html(errorText).removeClass("hidden");
}

function generateSignalBars(signal) {
    if (signal > 81) {
        return '<div class="wifibars"><div class="wifibar wifibar1"></div><div class="wifibar wifibar2"></div><div class="wifibar wifibar3"></div><div class="wifibar wifibar4"></div><div class="wifibar wifibar5"></div></div>';
    }
    
    if (signal > 61) {
        return '<div class="wifibars"><div class="wifibar wifibar1"></div><div class="wifibar wifibar2"></div><div class="wifibar wifibar3"></div><div class="wifibar wifibar4"></div><div class="wifibar wifibar5 wifibar-empty"></div></div>';
    }
    
    if (signal > 41) {
        return '<div class="wifibars"><div class="wifibar wifibar1"></div><div class="wifibar wifibar2"></div><div class="wifibar wifibar3"></div><div class="wifibar wifibar4 wifibar-empty"></div><div class="wifibar wifibar5 wifibar-empty"></div></div>';
    }
    
    if (signal > 21) {
        return '<div class="wifibars"><div class="wifibar wifibar1"></div><div class="wifibar wifibar2"></div><div class="wifibar wifibar3 wifibar-empty"></div><div class="wifibar wifibar4 wifibar-empty"></div><div class="wifibar wifibar5 wifibar-empty"></div></div>';
    }
    
    return '<div class="wifibars"><div class="wifibar wifibar1"></div><div class="wifibar wifibar2 wifibar-empty"></div><div class="wifibar wifibar3 wifibar-empty"></div><div class="wifibar wifibar4 wifibar-empty"></div><div class="wifibar wifibar5 wifibar-empty"></div></div>';
}
