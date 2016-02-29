var express = require('express');
var router = express.Router();
var fs = require("fs");
var Promise = require('bluebird');
var execAsync = Promise.promisify(require('child_process').exec);
var CountryLanguage = require('country-language');

router.get('/regional', function(req, res, next) {
    fs.readFile('/etc/timezone', 'utf8', function (err, data) {
        if (err) {
            data = "Etc/UTC";
        }
        
        res.render('settings/regional', {
            saved: typeof(req.query.saved) !== 'undefined',
            timezone: data.trim(),
            defaultTimezone: (data.trim() == "Etc/UTC")
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
    
    var commandCompleted = 0,
        commands = [
            "timedatectl set-timezone " + timezone,
            "update-locale LC_ALL="+lc+".UTF-8 LANG="+lc+".UTF-8",
            "locale-gen "+lc+" "+lc+".UTF-8",
            "DEBIAN_FRONTEND=noninteractive dpkg-reconfigure locales"
        ];
    
    execAsync(commands[0]).then(function() {
        execAsync(commands[1]).then(function() {
            execAsync(commands[2]).then(function() {
                execAsync(commands[3]).then(function() {
                    res.redirect('/settings/regional?saved');
                }).catch();
            }).catch();
        }).catch();
    }).catch();
});

module.exports = router;
