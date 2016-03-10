/*
udoo-web-conf - web configuration tool for UDOO boards
Copyright (C) 2015-2016 UDOO Team

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

var socket = io();

socket.on('connection', function(socket){
    console.log("Connected");
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

socket.on('cpuid', function(data) {
    document.getElementById('spancpuid').innerHTML = data;
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

socket.on('videooutput', function(data) {
    document.getElementById('spanvideo').innerHTML = data;
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
    
    $("a.remoteterminal").attr("href", "http://" + location.hostname + ":8000");
});
