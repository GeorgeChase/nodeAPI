var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');

mongoose.connect('mongodb://heroku_vsgzfrzr:nal10hsrqpa59sa0r9jh0ln3bf@ds213209.mlab.com:13209/heroku_vsgzfrzr');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});

var portfolioSchema = new mongoose.Schema({
    id: Number,
    symbol: String,
    user: Number,
    owned: Number
});

var Portfolio = mongoose.model('Portfolio', portfolioSchema);

var app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.route('/api/portfolio') //just the default route showing all data (makes sure we are getting data)
    .get(function (req, resp) {
        Portfolio.find({}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to portfolio' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
app.route('/api/portfolio/userInfo/:user') //get the users portfolio information based on user id (question g.) still needs to be completed
    .get(function (req, resp) {
        Portfolio.find({user: req.params.user}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to portfolio' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
app.route('/api/portfolio/summary/:user') //get the users portfolio information as a percentage for each stock based on user id (question h.) still needs to be completed
    .get(function (req, resp) {
        Portfolio.find({user: req.params.user}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to portfolio' });
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