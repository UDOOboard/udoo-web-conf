var ifconfig = require('wireless-tools/ifconfig');
var exec = require('child_process').exec;
var fs = require('fs');
var isOnline = require('is-online');

io.on('connection', function (socket) {
    var motionTimer;

    try {
        if (fs.lstatSync('/sys/devices/virtual/misc/FreescaleAccelerometer').isDirectory()) {
            enableMotionSensors();
            motionTimer = setInterval(readMotionSensors, 300);
        } else {
            console.log("No motion sensors on board!");
        }
    }
    catch (e) {
    }

    getStaticInfo();
    getDynamicInfo();

    socket.on('getnetworkstatus', function () {
        getDynamicInfo();
    });

    socket.on('iot-read-log', function(msg){
        if(iotLogFile)
            iotLogFile.kill();

        if(msg.enable){
            readLogIoT();
        }

    });


    socket.on('disconnect', function () {
        clearInterval(motionTimer);
    });
});

function getStaticInfo() {
    exec("/opt/udoo-web-conf/shscripts/serial.sh", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Launch serial script: ' + error);
        } else {
            io.emit('cpuid', stdout.toString());
        }
    });

    fs.readFile('/etc/hostname', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        io.emit('boardname', data)
    });

    exec("udooscreenctl get", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Launch udooscreenctl: ' + error);
        } else {
            io.emit('videooutput', stdout.toString().toUpperCase());
        }
    });
}

function getDynamicInfo() {
    var ethip = 'Not Connected';
    var wlanip = 'Not Connected';
    var usbip = 'Not Connected';
    var bt = 'Not Connected';
    var name = ' ';
    var wlansssid = ' ';

    ifconfig.status('eth0', function (err, status) {
        if (status && status.ipv4_address != undefined) {
            ethip = status.ipv4_address;
            io.emit('ethstatus', ethip);
        } else {
            io.emit('ethstatus', 'Not Available');
        }
    });

    ifconfig.status('wlan', function (err, status) {
        if (status && status.ipv4_address != undefined) {
            console.log("addre");
            wlanip = status.ipv4_address;
            io.emit('wlanstatus', wlanip);
            exec("iw dev wlan0 link | grep SSID", function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('Cannot Get Network SSID : ' + error);
                }
                else {
                    out = stdout.toString();
                    wlanssid = out.substring(out.indexOf(":") + 1)
                    io.emit('wlansssid', wlanssid);
                }
            });
        } else {
            io.emit('wlanstatus', 'Not Available');
        }
    });

    ifconfig.status('usb0', function (err, status) {
        if (status && status.ipv4_address != undefined) {
            usbip = status.ipv4_address;
            io.emit('usbstatus', usbip);
        } else {
            io.emit('usbstatus', 'Not Available');
        }
    });

    exec("hcitool dev |grep hci0| awk '{print $2}'", function (error, stdout, stderr) {
        if (error !== null) {
            io.emit('btstatus', 'Not Available');
        } else {
            var mac = stdout.toString().trim();
            if (mac) {
                io.emit('btstatus', mac);
            } else {
                io.emit('btstatus', 'Not Available');
            }
        }
    });

    isOnline()
        .then(function (isOnline) {
        var online = 'NO';
        if (isOnline) {
            online = 'YES'
        }

        io.emit('online', online);
    });
}

function enableMotionSensors() {
    console.log("Enabling motion sensors");

    exec("echo 1 > /sys/class/misc/FreescaleGyroscope/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Gyroscope: ' + error);
        }
    });
    exec("echo 1 > /sys/class/misc/FreescaleAccelerometer/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Accelerometer: ' + error);
        }
    });
    exec("echo 1 > /sys/class/misc/FreescaleMagnetometer/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Magnetometer: ' + error);
        }
    });
}

var zero = {
    modulus: 0,
    axis: [0, 0, 0]
};

var iotLog;

var acc = zero,
    gyro = zero,
    magn = zero;

var iotLogFile;

function readLogIoT() {
    const spawn = require('child_process').spawn;
    iotLogFile = spawn('tail', ['-f', '/var/log/upstart/udoo-iot-cloud-client.log'], {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    iotLogFile.stderr.on('data', function (data) {
        console.log('error ' + data);
        io.emit('iot-log', {
            err: data.toString()
        })
    });

    iotLogFile.stdout.on('data', function(data){
        console.log('data ' + data);
       io.emit('iot-log', {
           data: data.toString()
       })
    });

    iotLogFile.on('close', function (code) {

    });

    iotLogFile.on('error', function (error) {
    });
}

function readMotionSensors() {
    fs.readFile('/sys/class/misc/FreescaleAccelerometer/data', 'utf8', function (err, data) {
        if (err) {
            acc = zero;
            return;
        }
        var axis = data.split(",");
        axis = [parseInt(axis[0]), parseInt(axis[1]), parseInt(axis[2])];
        var modulus = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);

        acc = {
            modulus: modulus,
            axis: axis
        };
    });

    fs.readFile('/sys/class/misc/FreescaleGyroscope/data', 'utf8', function (err, data) {
        if (err) {
            gyro = zero;
            return;
        }
        var axis = data.split(",");
        axis = [parseInt(axis[0]), parseInt(axis[1]), parseInt(axis[2])];
        var modulus = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);

        gyro = {
            modulus: modulus,
            axis: axis
        };
    });

    fs.readFile('/sys/class/misc/FreescaleMagnetometer/data', 'utf8', function (err, data) {
        if (err) {
            magn = zero;
            return;
        }
        var axis = data.split(",");
        axis = [parseInt(axis[0]), parseInt(axis[1]), parseInt(axis[2])];
        var modulus = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);

        magn = {
            modulus: modulus,
            axis: axis
        };
    });

    io.emit('motion', {
        accelerometer: acc,
        gyroscope: gyro,
        magnetometer: magn
    });
}
