var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("./config/passport");

var app = express();

mongoose.connect('mongodb://dbuser:wotjd11442@ds243049.mlab.com:43049/mdb');

var db = mongoose.connection;
db.once("open", function(){
 console.log("DB connected");
});
db.on("error", function(err){
 console.log("DB ERROR : ", err);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:"MySecret", resave:true, saveUninitialized:true}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

// Routes
app.use("/", require("./routes/index"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));
app.use("/loan", require("./routes/loan"));

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});
