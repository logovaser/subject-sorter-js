/**
 * Created by logov on 16-Dec-16.
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    //apiRouter = require('./api'),
    siteRouter = require('./site');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

//app.use('/api', apiRouter);
app.use('/', siteRouter);
app.use(express.static(path.join(__dirname, 'site/public')));


require('express-ws')(app);
app.ws('/ws', function(ws, req) {
    ws.on('message', function (msg) {
        ws.send('Reply for message: "' + msg + '"')
    });
});


var port = process.env.PORT || 8221;
app.listen(port);
console.log('Server started on port ' + port);
