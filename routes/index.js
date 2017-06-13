var express = require('express');
var router = express.Router();
var util = require('util');
var Promise = require('bluebird');
var execAsync = Promise.promisify(require('child_process').exec);
var shScriptsPath = '/opt/udoo-web-conf/shscripts/';
var fs = require('fs');
router.get('/', function(req, res, next) {
    res.render('index', {});
});

router.get('/terminal', function(req, res, next) {
  res.render('terminal', {});
});

router.get('/tutorials', function(req, res, next) {
  res.render('tutorials');
});

router.get('/board/info', function(req, res, next){
	var hostname = fs.readFileSync("/etc/hostname", "utf8").replace(/\0/g, '').trim();
	
	res.json({
		boardId: req.app.locals.boardId,
		macAddress: req.app.locals.macAddress,
		hostname: hostname,
		boardType: req.app.locals.boardModel
	});
});

/* Configuration */
router.get('/keyboardlayouts', function(req, res, next){
    execAsync('sudo ' + shScriptsPath + 'getkblayouts.sh').then(function(r){ res.json({kblayouts: r })}).catch(function(r){ res.json({kblayouts: r }) });
});



module.exports = router;
