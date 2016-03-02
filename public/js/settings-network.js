$(function() {
    refreshWifiList();
    setInterval(refreshWifiList, 15000);
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
                
                for (var i=0; i<response.wifi.length; i++) {
                    var w = response.wifi[i];
                    var html = ['<a href="#" class="list-group-item" data-networkname="' + w.networkName + '" data-protected="' + w.isProtected + '">'];
                    if (w.isProtected) {
                        html.push('<span class="badge"><i class="fa fa-lock"></i></span>');
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
    var netProtected = $(this).data('protected');
    
    $('#wifiPassword input[name=ssid]').val(networkName);
    $('#wifiPassword input[type=password]').val('');
    
    if (netProtected) {
        $('#wifiPassword .modal-body strong').html(networkName);
        $('#wifiPassword').modal('show');
    } else {
        $('#wifiPassword form').submit();
    }
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
