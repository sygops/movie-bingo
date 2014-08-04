var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var level = require('level');

var app = express();
var db = level('./emailids', {'valueEncoding': 'json'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    res.sendfile('index.html');
});


app.get('/bingo/:hash', function (req, res) {
    var currentHash = req.params.hash;
    console.log(currentHash);
    var user = {};
    var id = crypto.createHash('md5').update(currentHash + Date.now()).digest('hex');
    
    if(req.cookies.id) {
        
    }
    
    db.get(currentHash, function (err, value) {
        if (err) {
            if(err.notFound) {
                res.sendfile('forgot.html');
            }
            return;
        }
        
        user = value;
        
        res.cookie('id', id, 
                   { path: '/bingo', maxAge: 8000000, httpOnly: true });
        res.sendfile('bingo.html');        
        
    });
});

app.post('/signup', function (req, res) {
    var user = {};
    
    var hash = crypto.createHash('md5').update(email).digest('hex');
    
    user['email'] = req.body.email;
    
    db.put(hash, user, function (err) {
        if (err) {
            console.log("can't add key-value pair");
        }
        
        res.send('Thanks for signing up!');
    });
    
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});