var express = require('express');
var router = express.Router();

var util = require('util');
var Promise = require('bluebird');
var execAsync = Promise.promisify(require('child_process').exec);
var shScriptsPath = '/opt/udoo-web-conf/shscripts/';

/* GET home page. */
router.get('/', function(req, res, next) {
  //var util = require('util');
  //var Promise = require('bluebird');
  /*var child_process = Promise.promisifyAll(require('child_process'));*/
  //var execAsync = Promise.promisify(require('child_process').exec);
  /*var spawn = require('child_process').spawn;*/
  /*var child = spawn('date');*/
  //var dateRes = execAsync('date').then(function(r){ res.render('index', {title: r })});


  /*util.inspect(child.stdout, {showHidden: false, depth: null})*/

  /*res.render('index', { title:  'asd'});*/
  res.render('index');
});

router.get('/firstconfig', function(req, res, next) {
  res.render('first-config');
});

router.get('/arduino', function(req, res, next) {
  res.render('arduino');
});

router.get('/date', function(req, res, next) {

  /*var child_process = Promise.promisifyAll(require('child_process'));*/
  /*var spawn = require('child_process').spawn;*/
  /*var child = spawn('date');*/
  //var execAsync = Promise.promisify(require('child_process').exec);
  execAsync('date').then(function(r){ res.json({dateData: r })}).catch(function(r){ res.json({dateData: r }) });


  /*util.inspect(child.stdout, {showHidden: false, depth: null})*/

  /*res.render('index', { title:  'asd'});*/
});

router.get('/timezone', function(req, res, next){
  //var execFileAsync = Promise.promisify(require('child_process').execFile());
  //execFileAsync('bash', ['timezone.sh']).then(function(r){ res.json({messaggio: r })}).catch(function(r){ res.json({messaggio: r }) });

  execAsync('sudo ' + shScriptsPath + 'timezone.sh').then(function(r){ res.json({messaggio: r })}).catch(function(r){ res.json({messaggio: r }) });

});

router.get('/hostname/:newName', function(req, res, next){
    var newName = req.params.newName;
    execAsync('sudo ' + shScriptsPath + 'sethostname.sh ' + newName).then(function(r){ res.json({hostname: r })}).catch(function(r){ res.json({hostname: r }) });
    /*util.inspect(child.stdout, {showHidden: false, depth: null})*/
});

router.get('/hostname', function(req, res, next){
  execAsync('hostname').then(function(r){ res.json({hostname: r })}).catch(function(r){ res.json({hostname: r }) });
  /*util.inspect(child.stdout, {showHidden: false, depth: null})*/
});

router.get('/keyboardlayouts', function(req, res, next){
    execAsync('sudo ' + shScriptsPath + 'getkblayouts.sh').then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});

router.get('/keyboardlayouts/:newLayout', function(req, res, next){
  var newLayout = req.params.newLayout;
  execAsync('sudo ' + shScriptsPath + 'setkblayouts.sh ' + newLayout).then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});

router.get('/wifiList', function(req, res, next){
  execAsync('nmcli dev wifi list').then(function(r){ res.json({wifiListOutput: r })}).catch(function(r){ res.json({wifiListOutput: r }) });
});

router.get('/connectWifi/:network', function(req, res, next){
  var networkName = req.params.network;
  execAsync('nmcli dev wifi con ' + '"' + networkName + '"').then(function(r){ res.json({wifiConnectionOutput: r })}).catch(function(r){ res.json({wifiConnectionOutput: r }) });
});

router.get('/connectWifi/:network/:networkPassword', function(req, res, next){
  var networkName = req.params.network;
  var networkPassword = req.params.networkPassword;
  execAsync('nmcli dev wifi con ' + '"' + networkName + '" ' + 'password ' + '"' + networkPassword + '"').then(function(r){ res.json({wifiConnectionOutput: r })}).catch(function(r){ res.json({wifiConnectionOutput: r }) });
});


module.exports = router;
