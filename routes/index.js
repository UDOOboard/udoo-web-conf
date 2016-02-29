var express = require('express');
var router = express.Router();
var util = require('util');
var Promise = require('bluebird');
var execAsync = Promise.promisify(require('child_process').exec);
var fs = require("fs");
var shScriptsPath = '/opt/udoo-web-conf/shscripts/';

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/arduino', function(req, res, next) {
  res.render('arduino');
});
router.get('/terminal', function(req, res, next) {
  res.render('terminal');
});

router.get('/tutorials', function(req, res, next) {
  res.render('tutorials');
});

router.get('/arduino-lite-ide', function(req, res, next) {
  res.render('arduino-lite-ide');
});

router.get('/ardublockly', function(req, res, next) {
  res.render('ardublockly');
});

router.get('/ardublocklystandalone', function(req, res, next) {
  res.render('ardublocklystandalone');
});


/* Configuration */

router.get('/firstconfig', function(req, res, next) {
  var hostname = fs.readFileSync("/etc/hostname", "utf8");
  res.render('first-config', {
      hostname: hostname
  });
});

router.post('/set-hostname', function (req, res) {
    execAsync('sudo ' + shScriptsPath + 'sethostname.sh ' + req.body.hostname).then(function(r){
        res.redirect('/firstconfig');
    }).catch(function(r){
        res.redirect('/firstconfig');
    });
});

router.get('/date', function(req, res, next) {
  execAsync('date').then(function(r){ res.json({dateData: r })}).catch(function(r){ res.json({dateData: r }) });
});

router.get('/timezone', function(req, res, next){
  execAsync('sudo ' + shScriptsPath + 'timezone.sh').then(function(r){ res.json({messaggio: r })}).catch(function(r){ res.json({messaggio: r }) });
});

router.get('/keyboardlayouts', function(req, res, next){
    execAsync('sudo ' + shScriptsPath + 'getkblayouts.sh').then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});

router.get('/keyboardlayouts/:newLayout', function(req, res, next){
  var newLayout = req.params.newLayout;
  execAsync('sudo ' + shScriptsPath + 'setkblayouts.sh ' + newLayout).then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});

router.get('/wifiList', function(req, res, next){
  execAsync('nmcli dev wifi list').then(function(r){
    
      var arrWifiList = r[0].split(/\r?\n/);
      var finalList = [];
      
      for (var i = 1; i < arrWifiList.length - 1; i++) { //skip first and last lines
          var start_pos = arrWifiList[i].indexOf('\'') + 1;
          var end_pos = arrWifiList[i].lastIndexOf('\'');
          var networkName = arrWifiList[i].substring(start_pos,end_pos);
          var isProtected = false;
          if (arrWifiList[i].indexOf("WPA") > -1 || arrWifiList[i].indexOf("WEP") > -1) {
              isProtected = true;
          }
          start_pos = arrWifiList[i].indexOf('MB/s') + 4;
          var signal = arrWifiList[i].substring(start_pos).trim();
          signal = parseInt(signal.substring(0, 3).trim());
          
          finalList.push({
              networkName: networkName,
              isProtected: isProtected,
              signal: signal,
              isSelected: false
          });
      }
      
      finalList = finalList.sort(function(a, b) {
        if (a.signal > b.signal) {
            return -1;
        } else {
            if (a.signal < b.signal) {
                return 1;
            } else {
                return 0;
            }
        }
      });
      
      res.json({
          success: true,
          wifi: finalList
      });
      
  }).catch(function(r){ res.json({ success: false }) });
});

router.post('/connect-wifi', function (req, res) {
    var ssid = req.body.ssid,
        password = req.body.password;
    
    if (password) {
        execAsync('nmcli dev wifi con ' + '"' + ssid + '" ' + 'password ' + '"' + password + '"').then(function(r){
            res.redirect('/firstconfig');
        }).catch(function(r){
            res.redirect('/firstconfig');
        });
    } else {
        execAsync('nmcli dev wifi con ' + '"' + ssid + '"').then(function(r){
            res.redirect('/firstconfig');
        }).catch(function(r){
            res.redirect('/firstconfig');
        });
    }
});


module.exports = router;
