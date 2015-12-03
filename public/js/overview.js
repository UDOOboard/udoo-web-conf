/**
 * Created by Michelangelo on 28/10/2015.
 */

var socket = io();

socket.on('connection', function(socket){

    setInterval(function () {
       socket.emit('getnetworkstatus', '');
    }, 10000);




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

socket.on('model', function(data){
  notifyModelData(data);
});

socket.on('macaddress', function(data){
  notifyMacAddressData(data);
});

socket.on('online', function(data){
  notifyOnlineData(data);
});

function notifyMotionData(data){


    var accwidth=(data.a);
    var gyrowidth=(data.g);
    var magnwidth=(data.m);
    $('#progress_bar_acc').css('width', accwidth + "px");
    $('#progress_bar_gyro').css('width', gyrowidth + "px");
    $('#progress_bar_magn').css('width', magnwidth + "px");
}


function notifyModelData(data){
  document.getElementById('spanmodel').innerHTML=data;
  if (data = 'FULL'){
  $("imagemodel").attr("src","/images/udoo_neo_full_hor.png");
} else if (data = 'EXTENDED') {
  $("imagemodel").attr("src","/images/udoo_neo_extended_hor.png");
} else  if (data = "BASIC"){
  $("imagemodel").attr("src","/images/udoo_neo_basic_hor.png");
} else {
  $("imagemodel").attr("src","/images/udoo_neo_full_hor.png");
}
}


function notifyMacAddressData(data){
  document.getElementById('spanmacaddress').innerHTML=data;
}

function notifyOnlineData(data){
  document.getElementById('spanonline').innerHTML=data;
}


function ethStatusData(data){
    document.getElementById('ethstatus').innerHTML=data;
}
function usbStatusData(data){
    document.getElementById('usbstatus').innerHTML=data;
}
function wlanStatusData(data){
    document.getElementById('wlanstatus').innerHTML=data;
}
function btStatusData(data){
    document.getElementById('bgstatus').innerHTML=data;
}
