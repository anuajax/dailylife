var express = require("express");
var router = express.Router({mergeParams:true});
var Journal =  require("../models/journal");

//INDEX -> show all journals
router.get("/journal", function(req,res){
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
router.post("/journal", function(req, res){
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
router.get("/journal/new", function(req, res){
   res.render("journal/new.ejs"); 
});

module.exports = router;