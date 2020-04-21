// Basic Setup : 
var express                 =  require("express");
var app                     =  express();
var mongoose                =  require("mongoose");
var bodyparser              =  require("body-parser");
var passport                =  require("passport");
var LocalStrategy           =  require("passport-local");
var passportLocalMongoose   =  require("passport-local-mongoose");
var methodOverride          =  require("method-override");

//MODELS:
var User                    =  require("./models/User");




//Require your ROUTES here:
var commentRoutes   =   require("./routes/comments");
var authRoutes      =   require("./routes/authorization");      


//Database connection
mongoose.connect("mongodb://localhost:27017/Dailylife", { useNewUrlParser: true , useUnifiedTopology: true  });
//-----------------*--------------------*-----------------------------------------*-----------------------------------


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

//-------------------------------------------------------------------------------------------------------------------
//PASSPORT CONFIG :
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "My life is mine i decide what to do",
    resave: false,
    saveUninitialized: false
}));  
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());   
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	next();
});

//==========================================================================================================
//ROUTES: use your Routes here for now i'm making dummy landing page:
app.get("/",function(req,res){
    res.render("landing");
});

app.use("/comments",commentRoutes);
app.use(authRoutes);




//SERVER
var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server started");
});