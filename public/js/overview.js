/**
 * Created by Michelangelo on 28/10/2015.
 */

var socket = io();

socket.on('connection', function(socket){
    setInterval(function () {
        socket.emit('getnetworkstatus', '');
    }, 10000);
});

socket.on('ethstatus', function(data) {
    document.getElementById('ethstatus').innerHTML = data;
});

socket.on('usbstatus', function(data) {
    document.getElementById('usbstatus').innerHTML = data;
});

socket.on('wlanstatus', function(data) {
    document.getElementById('wlanstatus').innerHTML = data;
});

socket.on('btstatus', function(data) {
    document.getElementById('btstatus').innerHTML = data;
});

socket.on('motion', function(data) {
    if (graphType == "axis") {
        var tmp;
        tmp = arduinoMap(Math.abs(data.accelerometer.axis[0]), 0, 16000, 0, 100);
        $(".progress.accelerometer-x div").width(tmp+"%");
        tmp = arduinoMap(Math.abs(data.accelerometer.axis[1]), 0, 16000, 0, 100);
        $(".progress.accelerometer-y div").width(tmp+"%");
        tmp = arduinoMap(Math.abs(data.accelerometer.axis[2]), 0, 16000, 0, 100);
        $(".progress.accelerometer-z div").width(tmp+"%");
        
        tmp = arduinoMap(Math.abs(data.gyroscope.axis[0]), 0, 16000, 0, 100);
        $(".progress.gyroscope-x div").width(tmp+"%");
        tmp = arduinoMap(Math.abs(data.gyroscope.axis[1]), 0, 16000, 0, 100);
        $(".progress.gyroscope-y div").width(tmp+"%");
        tmp = arduinoMap(Math.abs(data.gyroscope.axis[2]), 0, 16000, 0, 100);
        $(".progress.gyroscope-z div").width(tmp+"%");
        
        tmp = arduinoMap(Math.abs(data.magnetometer.axis[0]), 0, 16000, 0, 100);
        $(".progress.magnetometer-x div").width(tmp+"%");
        tmp = arduinoMap(Math.abs(data.magnetometer.axis[1]), 0, 16000, 0, 100);
        $(".progress.magnetometer-y div").width(tmp+"%");
        tmp = arduinoMap(Math.abs(data.magnetometer.axis[2]), 0, 16000, 0, 100);
        $(".progress.magnetometer-z div").width(tmp+"%");
        
    } else {
        var acc = arduinoMap(data.accelerometer.modulus, 0, 50000, 0, 100);
        $(".progress.accelerometer-modulus div").width(acc+"%");
        
        var gyro = arduinoMap(data.gyroscope.modulus, 0, 10000, 0, 100);
        $(".progress.gyroscope-modulus div").width(gyro+"%");
        
        var magn = arduinoMap(data.magnetometer.modulus, 0, 10000, 0, 100);
        $(".progress.magnetometer-modulus div").width(magn+"%");
    }
});

socket.on('model', function(data) {
    document.getElementById('spanmodel').innerHTML = data;
    if (data == "UDOO NEO FULL") {
        $("imagemodel").attr("src","/images/udoo_neo_full_hor.png");
    } else if (data == "UDOO NEO EXTENDED") {
        $("imagemodel").attr("src","/images/udoo_neo_extended_hor.png");
    } else if (data == "UDOO NEO BASIC" || data == "UDOO NEO BASIC KICKSTARTER") {
        $("imagemodel").attr("src","/images/udoo_neo_basic_hor.png");
    } else {
        $("imagemodel").attr("src","/images/udoo_neo_full_hor.png");
    }
});

socket.on('macaddress', function(data) {
    document.getElementById('spanmacaddress').innerHTML = data;
});

socket.on('online', function(data) {
    document.getElementById('spanonline').innerHTML = data;
});

socket.on('wlansssid', function(data) {
    document.getElementById('wlanssid').innerHTML = data;
});

socket.on('boardname', function(data) {
    document.getElementById('spanname').innerHTML = data;
});

function arduinoMap(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var graphType = "axis";

$(function() {
    $(".switch-axis").click(function() {
        graphType = "axis";
        $(".switch-axis").addClass("active");
        $(".switch-modulus").removeClass("active");
        
        $("#sensors-modulus").addClass("hidden");
        $("#sensors-axis").removeClass("hidden");
    });
    $(".switch-modulus").click(function() {
        graphType = "modulus";
        $(".switch-axis").removeClass("active");
        $(".switch-modulus").addClass("active");
        
        $("#sensors-modulus").removeClass("hidden");
        $("#sensors-axis").addClass("hidden");
    });
});
