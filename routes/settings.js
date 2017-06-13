var express = require('express');
var router = express.Router();
var fs = require("fs");
var Promise = require('bluebird');
var execAsync = Promise.promisify(require('child_process').exec);
var CountryLanguage = require('country-language');
var shScriptsPath = '/opt/udoo-web-conf/shscripts/';
var http = require('http');

router.get('/regional', function(req, res, next) {
    fs.readFile('/etc/timezone', 'utf8', function (err, data) {
        if (err) {
            data = "Etc/UTC";
        }

        var lang;

        execAsync("cat /etc/default/locale |grep LANG= |cut -c6-7").then(function(out) {
            lang = out.trim();
        }).finally(function() {
            res.render('settings/regional', {
                saved: typeof(req.query.saved) !== 'undefined',
                lang: lang,
                timezone: data.trim(),
                defaultTimezone: (data.trim() == "Etc/UTC")
            });
        });
    });
});



router.get('/regional-languages/:lang', function(req, res, next) {
    var lang = req.params.lang;
    CountryLanguage.getCountry(lang, function (err, country) {
        if (err) {
            console.log(err);
            res.json({
                success: false
            });
        } else {
            res.json({
                success: true,
                languages: country.languages
            });
        }
    });
});

router.post('/regional-update', function (req, res) {
    var timezone = req.body.timezone,
        country = req.body.country,
        language = req.body.language;

    var lc = language + "_" + country;

    execAsync("timedatectl set-timezone " + timezone).then(function() {
        execAsync("update-locale LC_ALL="+lc+".UTF-8 LANG="+lc+".UTF-8").catch(function() {
            execAsync("update-locale LC_ALL="+lc+".UTF-8").catch(function(){
                execAsync("update-locale LC_ALL="+lc).catch(function(){});
            });
        }).finally(function() {
            execAsync("locale-gen "+lc+" "+lc+".UTF-8").then(function() {
                execAsync("DEBIAN_FRONTEND=noninteractive dpkg-reconfigure locales").then(function() {
                    res.redirect('/settings/regional?saved');
                });
            });
        });
    });
});

router.get('/base', function(req, res, next) {
    var hostname = fs.readFileSync("/etc/hostname", "utf8");
    res.render('settings/base', {
        hostname: hostname,
        saved: typeof(req.query.saved) !== 'undefined'
    });
});


router.get('/network', function(req, res, next) {
    res.render('settings/network', {
        saved: typeof(req.query.saved) !== 'undefined'
    });
});

router.post('/set-hostname', function (req, res) {
    execAsync(shScriptsPath + 'sethostname.sh ' + req.body.hostname).then(function(r) {
        res.redirect('/settings/base?saved');
    });
});

router.post('/change-password', function (req, res) {
    console.log(req.body.password);
    console.log(req.body.password.length);

    switch (req.body.username) {
        case 'udooer':
            execAsync(shScriptsPath + 'setudooerpwd.sh ' + req.body.password).then(function(r) {
                res.redirect('/settings/base?saved');
            });
            break;

        case 'root':
            execAsync(shScriptsPath + 'setrootpwd.sh ' + req.body.password).then(function(r) {
                res.redirect('/settings/base?saved');
            });
            break;

        default:
            res.redirect('/settings/base');
    }
});

router.get('/wifi-networks', function(req, res, next){
  execAsync('nmcli dev wifi list').then(function(r){

      var arrWifiList = r.split(/\r?\n/);
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

router.post('/wifi-connect', function (req, res) {
    var ssid = req.body.ssid,
        password = req.body.password,
        command;

    if (password) {
        command = 'nmcli dev wifi con ' + '"' + ssid + '" ' + 'password ' + '"' + password + '"';
    } else {
        command = 'nmcli dev wifi con ' + '"' + ssid + '"';
    }

    execAsync(command).then(function(r){
        res.redirect('/settings/network?saved');
    });
});


router.get('/advanced', function(req, res, next) {
  var screenCtl;
  var m4Ctl = 'false';
  var port = global.webPort;

 if(req.app.locals.hasM4){

    execAsync('udooscreenctl get').then(function(screenctl) {
      screenCtl = screenctl.trim();

    }).then(function() {
      execAsync('udoom4ctl status').then(function(m4ctl) {
          fs.access('/etc/init/udoo-web-conf.override', fs.F_OK, function(err) {
              if (!err) {
                  port = -1;
              }
          });
          m4Ctl = m4ctl.trim();

    }).then(function() {
      res.render('settings/advanced', {
          port: port,
          video: screenCtl,
          m4: m4Ctl == 'true' ? 'enabled' : 'disabled',
          saved: typeof(req.query.saved) !== 'undefined'
      });
    });
    });

  } else {

    execAsync('udooscreenctl get').then(function(screenctl) {
      screenCtl = screenctl.trim();
    }).then (function() {
      fs.access('/etc/init/udoo-web-conf.override', fs.F_OK, function(err) {
          if (!err) {
              port = -1;
          }
      });
    }).then(function() {
      res.render('settings/advanced', {
          port: port,
          video: screenCtl,
          m4: m4Ctl == 'true' ? 'enabled' : 'disabled',
          saved: typeof(req.query.saved) !== 'undefined'
      });
    });

  }
});

router.get('/iot', function(req, res, next) {
	var hostname = fs.readFileSync("/etc/hostname", "utf8").replace(/\0/g, '').trim();
	var url_server = fs.readFileSync("/etc/udoo-web-conf/url_iot", "utf8").replace(/\0/g, '').trim(); 	
	
	
     res.render('settings/iot', {
         boardId : req.app.locals.boardId,
         hostname: hostname,
         boardType: req.app.locals.boardModel,
     	 server_url: url_server
	});
});

router.get('/iot/redis/:codes', function(req,res){
    var codes = req.params.codes;
    var jsonReq = {
        codes : codes
    };
    postToIoT(jsonReq, 'boardcodes', function(err){
        if(!err){
            return res.json({status: true})
        }else{
            return res.json({status:false, err:err});
        }
    });
});


router.get('/iot/service/:command', function (req, res) {
    var command = req.params.command;
    if(command === "status") controlIoTService(true, res);
    else execServiceIot(command, res);
});

router.get('/iot/install', function (req, res) {
    var service = {
        installed: false
    };
    var command = 'apt-get -qq update > /dev/null';
    execAsync(command).then(function (out) {
        const spawn = require('child_process').spawn;
        const child = spawn('apt-get', ['-qq', 'install', 'udoo-iot-cloud-client'], {
            detached: false,
            stdio: ['ignore', 'inherit', 'pipe']
        });

        child.stderr.on('data', (data) => {
            console.log('error ' + data);
        });

        child.on('close', (code) => {
            if (code == '0') {
                setTimeout(function () {
                    controlIoTService(false, res);
                }, 2000);
            } else {
                res.json({ status: false, service });
            }
        });

        child.on('error', function (error) {
            res.json({ status: false, service });
        });
    }, function (err) {
        res.json({ status: false, service });
    });
});

router.post('/set-video', function (req, res) {
    var video = req.body.video.trim();

    if (video != "hdmi" && video != "lvds7" && video != "lvds15" && video != "headless") {
        res.redirect('/settings/advanced');
        return;
    }

    execAsync("udooscreenctl set " + video).then(function(r){
        res.redirect('/settings/advanced?saved');
    });
});

router.post('/set-m4', function (req, res) {
    var m4 = req.body.m4.trim(),
             command;

    if (m4 == "enabled") {
        command = "udoom4ctl enable";
    } else {
        command = "udoom4ctl disable";
    }

    execAsync(command).then(function(r){
        res.redirect('/settings/advanced?saved');
    });
});

router.post('/set-http-port', function (req, res) {
    var port = req.body.port.trim(),
               command;

    if (port == "-1") {
        command = "echo manual > /etc/init/udoo-web-conf.override";
    } else {
        command = "echo " + parseInt(port) + " > /etc/udoo-web-conf/port; rm /etc/init/udoo-web-conf.override;";
    }

    execAsync(command).then(function(r){
        res.redirect('/settings/advanced?saved');
    }).catch(function(e) {
        res.redirect('/settings/advanced?saved');
    });
});

var execServiceIot = function (command, res) {
    var serviceCommand = "sudo service udoo-iot-cloud-client ";
    execAsync(serviceCommand + command).then(function (out) {
        controlIoTService(false, res);
    }, function (err) {
        controlIoTService(true, res);
    });
}

var controlIoTService = function (all, res) {
    var isInstalled = "dpkg -l udoo-iot-cloud-client | grep -c ^i";
    var service = {
        installed: false,
        started: false,
        state: {
            init : false,
            wait: false,
            running: false,
            message: ''
        }
    }
    execAsync(isInstalled).then(function (out) {
        if (out && out.trim() === '1') {
            service.installed = true;
            var startedCommand = "pgrep -F /run/udoo-iot-client.pid -c";
            execAsync(startedCommand).then(function (out) {
                if (out && out.trim() === '1') {
                    service.started = true;
                    if (all) {
                        getToIoT('status', function (err, data) {
                            if (!err && data) {
                                data = JSON.parse(data);
                                if(data.code == '0'){
                                    service.state.init = true;
                                }
                                else if (data.code == '1') {
                                    service.state.wait = true;
                                } else {
                                    service.state.running = true;
                                }
                                service.state.message = data.message;
                                return res.json({ status: true, service })
                            } else {
                                return res.json({ status: false, service });
                            }
                        });
                    }else{
                        service.state.init = true;
                        res.json({ status: true, service });
                    }
                } else {
                    res.json({ status: true, service });
                }
            }, function (err) {
                res.json({ status: true, service });
            });
        } else {
            res.json({ status: true, service });
        }
    }, function (err) {
        res.json({ status: true, service });
    });
}


function postToIoT(jsonReq, pathReq, callback) {
    jsonReq = JSON.stringify(jsonReq);
    var options = {
        hostname: 'localhost',
        port: 16969,
        path: '/'+pathReq,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(jsonReq)
        }
    };

    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        if(res.statusCode=== 200){
            callback(null);
        }else{
            callback('error');
        }
    });

    if (req) {
        
        req.on('error', function(error) {
            console.log('connectio '+error);
        });

        req.write(jsonReq);
        req.end();
    }
}

function getToIoT(pathReq, callback) {
    var options = {
        hostname: 'localhost',
        port: 16969,
        path: '/' + pathReq,
        method: 'GET',
    };

    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        if (res.statusCode === 200) {
            var body = "";
            res.on('data', function (data) {
                body += data;
            });
            res.on('end', function () {
                callback(null, body);
            });
        } else {
            callback('error');
        }
    });

    if (req) {
        req.on('error', function(error) {
            console.log('connectio '+error);
            callback(error);
        });
        req.end();
    }
}

module.exports = router;
