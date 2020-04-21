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





mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/Dailylife", { useNewUrlParser: true , useUnifiedTopology: true  });

//Require your routes here:
// var commentRoutes = require("./routes/comments");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(methodOverride("_method"));


//use your Routes here for now i'm making dummy landing page:
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
// app.use("/comments",commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server started");
});