var ifconfig = require('wireless-tools/ifconfig');
var exec = require('child_process').exec;
var fs = require('fs');
var isOnline = require('is-online');

io.on('connection', function(socket) {
    var clientconnected = true;
    console.log('Frontend Connected');

    // Get IP Addresses
    getsysteminfos();
    setInterval(function () {
        getsysteminfos();
    }, 10000);

    if (clientconnected) {
        getMotionSensors();
    }

    socket.on('disconnect', function () {
        clientconnected = false;
        console.log('Client Disconnected');
    });
});

function getsysteminfos() {
    var ethip = 'Not Connected';
    var wlanip = 'Not Connected';
    var usbip = 'Not Connected';
    var bt = 'Not Connected';
    var name = ' ';
    var model = ' ';
    var wlansssid = ' ';

    ifconfig.status('eth0', function(err, status) {
        if (status != undefined) {
            if (status && status.ipv4_address != undefined ) {
                ethip = status.ipv4_address;
                io.emit('ethstatus', ethip);
            }
        } else {
            io.emit('ethstatus', 'Not Available');
        }
    });

    ifconfig.status('wlan', function(err, status) {
        if (status != undefined) {
            if (status.ipv4_address != undefined ) {
                wlanip = status.ipv4_address;
                io.emit('wlanstatus', wlanip);
                exec("iw dev wlan0 link | grep SSID",  function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('Cannot Get Network SSID : ' +error);
                    }
                    else {
                        out = stdout.toString();
                        wlanssid = out.substring(out.indexOf(":")+1)
                        io.emit('wlansssid', wlanssid);
                        //console.log(wlanssid)
                    }
                });
            }
        } else {
            io.emit('wlanstatus', 'Not Available');
        }
    });

    ifconfig.status('usb0', function(err, status) {
        if (status.ipv4_address != undefined ) {
            usbip = status.ipv4_address;
            io.emit('usbstatus', usbip);
        }
    });

    exec("/opt/udoo-web-conf/shscripts/model.sh",  function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Launch model script: ' +error);
        } else {
            model = stdout.toString();
            io.emit('model', 'UDOO NEO ' +model);
        }
    });

    require('getmac').getMac(function(err,macAddress) {
        if (err)  throw err
        io.emit('macaddress', macAddress);
    });
    
    isOnline(function(err, online) {
        var online= 'NO';
        if (online = 'TRUE') {
            isonline= 'YES'
        }

        io.emit('online', isonline);
    });

    fs.readFile('/etc/hostname', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        io.emit('boardname', data)
    });
}

function getMotionSensors() {
    console.log('Reading Motion Sensors Values');

    exec("echo 1 > /sys/class/misc/FreescaleGyroscope/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Gyroscope: '+error);
        }
    });
    exec("echo 1 > /sys/class/misc/FreescaleAccelerometer/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Accelerometer: '+error);
        }
    });
    exec("echo 1 > /sys/class/misc/FreescaleMagnetometer/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Magnetometer: '+error);
        }
    });
    
    var acc = 0, gyro = 0, magn = 0;
  
    setInterval(function () {
        fs.readFile('/sys/class/misc/FreescaleAccelerometer/data', 'utf8', function (err, data) {
            if (err) {
                acc = 0;
                return;
            }
            var arr = data.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            acc = Math.sqrt(((arr[0])*(arr[0]))+(((arr[1]))*(arr[1]))+((arr[2])*(arr[2]))).toFixed(0);
            acc = acc/1630;
            acc = acc.toFixed(0);
            acc = acc*acc-90;
        });
        
        fs.readFile('/sys/class/misc/FreescaleGyroscope/data', 'utf8', function (err, data) {
            if (err) {
                gyro = 0;
                return;
            }
            var arr = data.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            gyro = Math.floor(Math.sqrt(((arr[0])*(arr[0]))+(((arr[1]))*(arr[1]))+((arr[2])*(arr[2]))));
            if (gyro > 150) {
                gyro = 150;
            }
        });

        fs.readFile('/sys/class/misc/FreescaleMagnetometer/data', 'utf8', function (err, data) {
            if (err) {
                magn = 0;
                return;
            }
            var arr = data.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            magn = Math.floor(Math.sqrt(((arr[0])*(arr[0]))+(((arr[1]))*(arr[1]))+((arr[2])*(arr[2]))));
            magn = magn/100;
            magn = magn.toFixed(0);
            if (magn > 150) {
                magn = 150
            }
        });

        io.emit('motion', {a:acc, g:gyro, m:magn});
    }, 300);

}
