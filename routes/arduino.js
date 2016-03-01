var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');

router.get('/samples', function(req, res, next) {
    res.render('arduino/samples');
});

router.get('/webide', function(req, res, next) {
    fs.readFile('/opt/udoo-web-conf/mysketch/mysketch.ino', 'utf8', function (err, data) {
        if (err) {
            data = "";
        }
        res.render('arduino/webide', {
            sketch: data
        });
    });
});

router.get('/ardublockly', function(req, res, next) {
    res.render('arduino/ardublockly', {
        standalone: typeof(req.query.standalone) !== 'undefined'
    });
});

router.get('/uploadsketch/:name', function(req, res) {
    if (/^[a-zA-Z]+$/.test(req.params.name) === false) {
        console.log("Discarded sketch to flash: " + req.params.name);
    } else {
        exec("/usr/bin/udooneo-m4uploader /opt/udoo-web-conf/arduino_examples/"+req.params.name+".cpp.bin", function (error, stdout, stderr) {
            if (error !== null) {
                console.log('Cannot Upload Sketch: ' +error);
                res.json({
                    success: false,
                    message: 'Cannot Upload Sketch: ' +error
                });
            } else {
                res.json({
                    success: true
                });
            }
        });
    }
});

router.post('/compilesketch', function (req, res) {
    var sketch = req.body.sketch;
    fs.writeFile("/opt/udoo-web-conf/mysketch/mysketch.ino", sketch, 'utf8',  function(err) {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            exec("export DISPLAY=:0 && /usr/bin/arduino --upload /opt/udoo-web-conf/mysketch/mysketch.ino", {uid:1000, gid:20}, function (error, stdout, stderr) {
                if (error !== null) {
                    var fullerror = error.toString();
                    var trimerror = fullerror.split("mysketch.ino:").pop();
                    res.json({
                        success: false,
                        message: trimerror
                    });
                    console.log('Cannot Upload Sketch: '+fullerror);
                }
                else {
                    res.json({
                        success: true
                    });
                }
            });
        }
    });
});



module.exports = router;
