/**
 * Created by logov on 16-Dec-16.
 */

var express = require('express'),
    path = require('path'),
    router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/site/public/index.html'))
});

router.get('/settings', function (req, res) {
    res.sendFile(path.join(__dirname + '/site/public/pages/Settings.html'))
});

router.get('/stats', function (req, res) {
    res.sendFile(path.join(__dirname + '/site/public/pages/Stats.html'))
});

module.exports = router;
