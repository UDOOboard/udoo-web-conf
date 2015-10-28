/**
 * Created by Michelangelo on 28/10/2015.
 */

var socket = io();

socket.on('connection', function(socket){


});



socket.on('ethstatus', function(data){
    ethStatusData(data);
});

socket.on('usbstatus', function(data){
    usbStatusData(data);
});

socket.on('wlanstatus', function(data){
    wlanStatusData(data);
});

socket.on('btstatus', function(data){
    btStatusData(data);
});

socket.on('motion', function(data){
    notifyMotionData(data);
});

function notifyMotionData(data){

    document.getElementById('Accelerometer').innerHTML=data.a;
    document.getElementById('Gyroscope').innerHTML=data.g;
    document.getElementById('Magnetometer').innerHTML=data.m;
    var accwidth=(data.a);
    var gyrowidth=(data.g);
    var magnwidth=(data.m);
    $('#progress_bar_acc').css('width', accwidth + "px");
    $('#progress_bar_gyro').css('width', gyrowidth + "px");
    $('#progress_bar_magn').css('width', magnwidth + "px");
}





function ethStatusData(data){
    document.getElementById('ethstatus').innerHTML=data;
}
function usbStatusData(data){
    document.getElementById('ethstatus').innerHTML=data;
}
function wlanStatusData(data){
    document.getElementById('ethstatus').innerHTML=data;
}
function btStatusData(data){
    document.getElementById('ethstatus').innerHTML=data;
}