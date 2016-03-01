var express = require('express');
var router = express.Router();

router.get('/samples', function(req, res, next) {
  res.render('arduino/samples');
});

router.get('/webide', function(req, res, next) {
  res.render('arduino/webide');
});

router.get('/ardublockly', function(req, res, next) {
  res.render('arduino/ardublockly', {
      standalone: typeof(req.query.standalone) !== 'undefined'
  });
});

module.exports = router;
