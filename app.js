var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port    = process.env.PORT || 8000;

// mongoose.connect('mongodb://localhost/yourProject');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// var yourSchema = new mongoose.Schema({
//     url:String,
//     hash:Number
// });

// var Your = mongoose.model('Your',yourSchema);

//landing route
app.get('/',function(req,res){
   res.redirect('/home');
});

app.get('/home',function(req,res){
	res.render('home');
});

app.listen(port);
console.log('The magic happens on port ' + port);