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
  res.render('ardublockly', {
      standalone: typeof(req.query.standalone) !== 'undefined'
  });
});

router.get('/ardublocklystandalone', function(req, res, next) {
  res.render('ardublocklystandalone');
});


/* Configuration */
router.get('/keyboardlayouts', function(req, res, next){
    execAsync('sudo ' + shScriptsPath + 'getkblayouts.sh').then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});


module.exports = router;
