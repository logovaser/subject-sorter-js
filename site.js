/**
 * Created by logov on 16-Dec-16.
 */

var express = require('express'),
    path = require('path'),
    router = express.Router();

router.get(['/', '/home', '/settings', '/stats'], function (req, res) {
    res.sendFile(path.join(__dirname + '/site/public/index.html'))
});

module.exports = router;
