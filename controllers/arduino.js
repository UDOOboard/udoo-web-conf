var exec = require('child_process').exec;
var fs = require('fs');

io.on('connection', function(socket){
  
    socket.on('fade', function(){
        console.log('Fade');
        uploadsketchfade();
    });

    socket.on('blink', function(){
        console.log('Blink');
        uploadsketchblink();
    });

    socket.on('getcurrent-sketch', function (){
        fs.readFile('/opt/udoo-web-conf/mysketch.ino', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            socket.emit('current-sketch', data);
            console.log('current sketch: ' + data);
        });
    });

    socket.on('upload-sketch', function (data) {
        fs.writeFile("/opt/udoo-web-conf/mysketch/mysketch.ino", data, 'utf8',  function(err) {
            if(err) {
                socket.emit('simple-ide-error', err);
                return console.log(err);
            }

            console.log("The file was saved!");
            socket.emit('simple-ide', 'Verifying & Uploading Sketch, please wait...');
            exec("export DISPLAY=:0 && /usr/bin/arduino --upload /opt/udoo-web-conf/mysketch/mysketch.ino", {uid:1000, gid:20}, function (error, stdout, stderr) {
                if (error !== null) {
                    fullerror = error.toString();
                    trimerror = fullerror.split("mysketch.ino:").pop();
                    socket.emit('simple-ide-error', trimerror);
                    console.log('Cannot Upload Sketch: '+fullerror);
                }
                else {
                    socket.emit('simple-ide', 'Sketch successfully uploaded!');
                }
            });
        });
    });
});

function uploadsketchblink() {
    exec("/usr/bin/udooneo-m4uploader /opt/udoo-web-conf/arduino_examples/Blink.cpp.bin", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Upload Sketch' +error);
        }
    });
}

function uploadsketchfade(){
    exec("/usr/bin/udooneo-m4uploader /opt/udoo-web-conf/arduino_examples/Fade.cpp.bin", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Upload Sketch' +error);
        }
    });
}
