var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');

mongoose.connect('mongodb://heroku_vsgzfrzr:nal10hsrqpa59sa0r9jh0ln3bf@ds213209.mlab.com:13209/heroku_vsgzfrzr');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});

var companySchema = new mongoose.Schema({
    symbol: String,
    name: String,
    sector: String,
    subindustry: String,
    address: String,
    date_added: String,
    frequency: Number
});

var Company = mongoose.model('Company', companySchema);

var app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.route('/api/companies') //just the default route showing all data (makes sure we are getting data)
    .get(function (req, resp) {
        Company.find({}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to companies' });
            }
            else {
                resp.json(data);
            }
        });
    });

app.route('/api/companies/list') //just the list of all companies with symbol and name (question i) done
    .get(function (req, resp) {
        Company.find({}, 'symbol name -_id', function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to companies' });
            }
            else {
                resp.json(data);
            }
        });
    });
    
app.route('/api/companies/:symbol') //getting the company information for a single symbol (question b) is complete
    .get(function (req, resp) {
        Company.find({symbol: req.params.symbol}, function(err, data) {
            if(err) {
                resp.json({ message: 'Unable to connect to companies' });
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