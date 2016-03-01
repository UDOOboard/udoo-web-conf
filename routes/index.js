var express = require('express');
var router = express.Router();
var util = require('util');
var Promise = require('bluebird');
var execAsync = Promise.promisify(require('child_process').exec);
var shScriptsPath = '/opt/udoo-web-conf/shscripts/';

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/terminal', function(req, res, next) {
  res.render('terminal');
});

router.get('/tutorials', function(req, res, next) {
  res.render('tutorials');
});

/* Configuration */
router.get('/keyboardlayouts', function(req, res, next){
    execAsync('sudo ' + shScriptsPath + 'getkblayouts.sh').then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});

module.exports = router;
