/**
 * Created by logov on 16-Dec-16.
 */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    fontSchema = mongoose.Schema({
        name: String,
        weights: [{
            name: String,
            fileName: String
        }]
    });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/fontend');
var db = mongoose.connection,
    fonts;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongodb is connected!');
    fonts = mongoose.model('fonts', fontSchema);
    // (new fonts({
    //     name: 'Roboto',
    //     weights: [
    //         {
    //             name: 'Roboto Thin',
    //             fileName: 'Roboto-Thin.ttf'
    //         },
    //         {
    //             name: 'Roboto Light',
    //             fileName: 'Roboto-Light.ttf'
    //         },
    //         {
    //             name: 'Roboto Regular',
    //             fileName: 'Roboto-Regular.ttf'
    //         },
    //         {
    //             name: 'Roboto Bold',
    //             fileName: 'Roboto-Bold.ttf'
    //         }
    //     ]
    // })).save();
});

router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

router.route('/fonts')
    .get(function (req, res) {
        fonts.find(function (err, items) {
            if (err) return console.error(err);
            res.json(items)
        });
    });
// .post(function (req, res) {
//     console.log(req.body);
//     res.json({message: 'Bear created!'});
// });

module.exports = router;
