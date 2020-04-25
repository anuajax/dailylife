// Basic Setup : 
require("dotenv").config();
var express                 =  require("express");
var app                     =  express();
var mongoose                =  require("mongoose");
var bodyparser              =  require("body-parser");
var passport                =  require("passport");
var LocalStrategy           =  require("passport-local").Strategy;
var passportLocalMongoose   =  require("passport-local-mongoose");
var methodOverride          =  require("method-override");
var async                   =  require("async");
var nodemailer              =  require("nodemailer");
var crypto                  =  require("crypto");
var cookieParser            =  require("cookie-parser");
var flash                   =  require("connect-flash");
var Journal 				=  require("./models/journal");

//MODELS:
var User                    =  require("./models/User");




//Require your ROUTES here:
var commentRoutes   =   require("./routes/comments");
var authRoutes      =   require("./routes/authorization");   
var journalRoutes   =   require("./routes/journal");
var articleRoutes   =   require("./routes/article");



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//Database connection
mongoose.connect("mongodb://localhost:27017/Dailylife", { useNewUrlParser: true , useUnifiedTopology: true  });
//-----------------*--------------------*-----------------------------------------*-----------------------------------



app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(flash());

//-------------------------------------------------------------------------------------------------------------------
//PASSPORT CONFIG :
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "My life is mine i will decide what to do",
    resave: false,
    saveUninitialized: true
}));  
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) {
//           return done(null, false, { message: 'Incorrect username.' });
//         }
//         if (!user.validPassword(password)) {
//           return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, user);
//       });
//     }
//   ));
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


app.use(journalRoutes);
app.use("/comments",commentRoutes);
app.use(authRoutes);
app.use("/article",articleRoutes);



//SERVER
var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server started");
});