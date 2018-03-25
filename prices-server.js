var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');

mongoose.connect('mongodb://heroku_vsgzfrzr:nal10hsrqpa59sa0r9jh0ln3bf@ds213209.mlab.com:13209/heroku_vsgzfrzr');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});

var priceSchema = new mongoose.Schema({
    date: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    name: String
});

var Price = mongoose.model('Price', priceSchema);

var app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.route('/api/prices') //just the default route showing all data (makes sure we are getting data)
    .get(function (req, resp) {
        Price.find({}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to price' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
app.route('/api/prices/:symbol/:month') //get price info for each day in the month (question c.) still need to do, will need to regex the month out of the date and match (the actual regex to get month out is (?<=^[^-]+-)[^-]+ but i need to match based on param)
    .get(function (req, resp) {
        // Price.find({ date: new RegExp('\d+\-' + req.params.month, "i"), name: req.params.symbol },  function(err, data) {
         //Price.find({ date: /\d{4}-01/i , name: req.params.symbol }, function(err, data) {
         var month = req.params.month;
         var pattern = "\\d{4}-";
         var patAndMonth = pattern + month;
         Price.find({ date: new RegExp(patAndMonth) , name: req.params.symbol },  function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to price' });
                }
                else {
                    resp.json(data);
                }
            });
        });

app.route('/api/prices/average/:symbol') //get average close value for each month in the year (question d.) still need to do, requires me to grab all the close values in each month and average them
    .get(function (req, resp) {
        Price.find({name: req.params.symbol}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to price' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
app.route('/api/prices/:symbol/:date') //get price information for that date (question e.) Done
    .get(function (req, resp) {
        Price.find({name: req.params.symbol, date: req.params.date}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to price' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
app.route('/api/prices/latest/:symbol') //get latest price information for that symbol (question f.) not complete yet
    .get(function (req, resp) {
        Price.aggregate({ $match: {name: req.params.symbol} }, { $group: { "symbol": {"$first": "$name"} } }, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to price' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
let port = 8080;
app.listen(port, function () {
    console.log("Server running at port= " + port);
})