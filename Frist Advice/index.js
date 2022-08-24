//import dependencies 
var express = require('express');
var path = require('path');
var myApp = express();
const session = require('express-session');

myApp.use(express.urlencoded({extended:true}));

//setting path to 'public' and 'views' folder
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');

//linking to database
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/firstadvice', {
    UseNewUrlParser: true,
    UseUnifiedTopology: true    
})

//Model
const Admin = mongoose.model('admin', {
    username : String,
    password : String
})

//Setup Session
myApp.use(session({
    secret : "thisismyrandomkeysuperrandomsecret",
    resave : false,
    saveUninitialized : true
}))

//routes
myApp.get('/', function(req, res){
    res.render('index');
});

myApp.get('/register', function(req, res){
    res.render('register');
});

myApp.get('/login', function(req, res){
    res.render('login');
});

myApp.post('/login', function (req,res) {
    var user = req.body.username;
    console.log(`username: ${user}`);
    var pass = req.body.password;
    console.log(`password: ${pass}`);

    Admin.find({username : user, password : pass}).exec(function (err, admin) {
        console.log(`Error: ${err}`);
        console.log(`Admin: ${admin}`);

        if (admin) 
        {
            req.session.username = admin.username;
            req.session.userLoggedIn = true;

            res.redirect('/');
        }
        else
        {
            res.render('login', {error : "Please try again later!"});
        }
    })
});

myApp.get('/checklist', function(req, res){
    if(req.session.userLoggedIn == true)
        res.render('checklist');
    else
    {
        res.redirect('/');
    }
});

myApp.get('/accomodation', function(req, res){
    if(req.session.userLoggedIn == true)
        res.render('accomodation');
    else
    {
        res.redirect('/');
    }
});

myApp.get('/job', function(req, res){
    if(req.session.userLoggedIn == true)
        res.render('job');
    else
    {
        res.redirect('/');
    }
});

myApp.listen(8080);
console.log('Open - https://localhost:8080/');