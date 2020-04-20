// Basic Setup : 
var express                 =  require("express");
var app                     =  express();
var mongoose                =  require("mongoose");
var bodyparser              =  require("body-parser");
var passport                =  require("passport");
var LocalStrategy           =  require("passport-local");
var passportLocalMongoose   =  require("passport-local-mongoose");
var methodOverride          =  require("method-override");

mongoose.connect("mongodb://localhost:27017/Dailylife", { useNewUrlParser: true , useUnifiedTopology: true  });

//Require your routes here:


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(methodOverride("_method"));


//use your Routes here for now i'm making dummy landing page:
app.get("/",(req,res) => res.render("landing.ejs"));



var port = process.env.PORT || 3000;
app.listen(port,() => console.log(" okay Dailylife Server is listening"));