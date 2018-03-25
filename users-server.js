var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');
var md5 = require('crypto-md5');

mongoose.connect('mongodb://heroku_vsgzfrzr:nal10hsrqpa59sa0r9jh0ln3bf@ds213209.mlab.com:13209/heroku_vsgzfrzr');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});

var userSchema = new mongoose.Schema({
   id: Number,
   first_name: String,
   last_name: String,
   email: String,
   salt: String,
   password: String
});

var User = mongoose.model('User', userSchema);

var app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.route('/api/users') //authentication sending back id, first, last if correct
    .get(function (req, resp) {
        User.find({}, function(err, data) {
            if(err) { //if checked and email is not found then it doesn't exist
                resp.json({ message: 'Email does not exist' });
            }
            else {
                
                resp.json(data);
            }
        });
    });

app.route('/api/:email/:password') //authentication sending back id, first, last if correct (question a.) is working
    .get(function (req, resp) {
        User.find({email: req.params.email}, 'salt -_id', function(err, data) {
            if(err) {
                resp.json({ message: 'error!' });
            }
            if(!data.length) {
                resp.json({ message: 'Email does not exist!'});
            }
            else {
                //user exists and salt and password combined and hashed
                var userSalt = data[0]['salt'];
                var saltAndPass = md5(req.params.password + userSalt, "hex");
                
                //match the value to password in user collection
                User.find({email: req.params.email, password: saltAndPass}, 'id first_name last_name -_id', function(err, match) {
                    if(err) {
                        resp.json({ message: 'error!'});
                    }
                    if(!match.length) {
                        resp.json({ message: 'Password does not match! Authentication failed!'});
                    }
                    else {
                        resp.json(match);
                    }
                })
            }
        });
    });
    
let port = 8080;
app.listen(port, function () {
    console.log("Server running at port= " + port);
})