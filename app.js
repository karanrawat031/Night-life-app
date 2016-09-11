'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port    = process.env.PORT || 8080;
var passport    = require('passport');
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local');
var router = express.Router();
var passportLocalMongoose = require("passport-local-mongoose");
var request = require('request');
var Yelp = require('yelp');

mongoose.connect('mongodb://localhost/nightlife');

const Schema = mongoose.Schema;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

//user schema
var UserSchema = new Schema({
    username: String,
    email:String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

app.use(require("express-session")({
    secret: "Hello There",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//landing route
app.get('/',function(req,res){
   res.redirect('/home');
});

app.get('/home',function(req,res){
	res.render('home');
});

//showing the register
app.get('/register',function(req,res){
  res.render('register');
});

//Into the database
app.post('/register',function(req,res){
   var newUser = new User({username: req.body.username,email:req.body.email});
   User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/home");
});

app.get('/search',isLoggedIn,function(req,res){
	res.render('search');
});

app.post('/search',isLoggedIn,function(req,res){
  var search = req.body.search;
  var yelp = new Yelp({
  consumer_key: 'Jw5fzOXM_4CYRs6ls7S5PA',
  consumer_secret: 'ajLfo3KSwB77anx_H8j3RRus-go',
  token: 'GS--x94r8y-JEeCQTSvwCmzmPr-ZqgT6',
  token_secret: '8E3g9Op3FFc_7_j5QiVHlFjW9g8',
});

  yelp.search({ term: 'restaurants', location: search })
  .then(function (data) {
    var data2 = JSON.stringify(data);
    res.render('show',{data2:data2});
  })
  .catch(function (err) {
    console.error(err);
  });

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(port);
console.log('The magic happens on port ' + port);