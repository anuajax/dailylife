// Basic Setup : 
var express                 =  require("express");
var app                     =  express();
var mongoose                =  require("mongoose");
var bodyparser              =  require("body-parser");
var passport                =  require("passport");
var LocalStrategy           =  require("passport-local");
var passportLocalMongoose   =  require("passport-local-mongoose");
var methodOverride          =  require("method-override");
var Journal 				=  require("./models/journal");

<<<<<<< HEAD
=======
//MODELS:
var User                    =  require("./models/User");
>>>>>>> 2abb784953e9cc3db7a6b3fc68c800e2183aaa27




<<<<<<< HEAD
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
=======
//Require your ROUTES here:
var commentRoutes   =   require("./routes/comments");
var authRoutes      =   require("./routes/authorization");      


//Database connection
>>>>>>> 2abb784953e9cc3db7a6b3fc68c800e2183aaa27
mongoose.connect("mongodb://localhost:27017/Dailylife", { useNewUrlParser: true , useUnifiedTopology: true  });
//-----------------*--------------------*-----------------------------------------*-----------------------------------

<<<<<<< HEAD
Require your routes here:
var commentRoutes = require("./routes/comments");
=======
>>>>>>> 2abb784953e9cc3db7a6b3fc68c800e2183aaa27

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



//INDEX -> show all journals
app.get("/journal", function(req,res){
	// Get all journals from DB
	Journal.find({}, function(err, allJournals){
	if(err){
	console.log(err);
	} else {
          res.render("journal/index", {journals:allJournals});
       }
    });
});

//CREATE - add new journal to DB
app.post("/journal", function(req, res){
    // get data from form and add to journal array
    var title = req.body.title;
    var desc = req.body.description;
    var newJournal = {title: title, description: desc}
    // Create a new journal and save to DB
    Journal.create(newJournal, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to journal page
            res.redirect("/journal");
        }
    });
});


//NEW - show form to create new journal
app.get("/journal/new", function(req, res){
   res.render("journal/new.ejs"); 
});









// var journalRoutes = require("./routes/journal");

// app.use("/journals",journalRoutes);
app.use("/comments",commentRoutes);
app.use(authRoutes);




//SERVER
var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server started");
});