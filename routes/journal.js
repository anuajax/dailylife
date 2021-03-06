var express = require("express");
var router = express.Router({mergeParams:true});
var User = require("../models/User");
var Journal =  require("../models/journal");

//Index route to show all journals
router.get("/user/:id/journal",function(req,res){
    User.findById(req.params.id).populate("journals").exec(function(err, user){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("journal/index",{user: user});
        }
    });
});

//New Journal
router.get("/user/:id/journal/new", function(req,res){
	User.findById(req.params.id, function(err, user){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(user);
            res.render("journal/new",{user: user});
        }
    })
});

//CREATE - add new journal to DB
router.post("/user/:id/journal", function(req, res){
    User.findById(req.params.id, function(err, userFound){
        if(err)
        {
            res.redirect("/user");
        }
        else
        {
            Journal.create(req.body.Journal,function(err, journal){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    journal.text = req.body.journalText;
                    journal.author.id = req.params.id;
                    journal.author.username = userFound.username;
                    journal.save();
                    console.log(journal);
                    userFound.journals.push(journal);
                    userFound.save();
                    res.redirect('/user/' + req.params.id + "/journal");

                }
            })
        }

    })
});

//EDIT journal
router.get("/user/:id/journal/:journal_id/edit", function(req, res){
    Journal.findById(req.params.journal_id, function(err, foundJournal){
       if(err){
           res.redirect("back");
       } else {
         res.render("journal/edit", {user_id: req.params.id, journal: foundJournal});
       }
    });
 });


 // UPDATE journal
router.put("/user/:id/journal/:journal_id", function(req, res){
    Journal.findByIdAndUpdate(req.params.journal_id, req.body.journal, function(err, updatedJournal){
       if(err){
           res.redirect("back");
       } else {
           res.redirect('/user/' + req.params.id + "/journal");
       }
    });
 });


//SHOW Journal
router.get("/user/:id/journal/:journal_id",function(req,res){
    Journal.findById(req.params.journal_id, function(err, foundJournal){
        if(err){
            res.redirect("back");
        } else {
          res.render("journal/show", {user_id: req.params.id, journal: foundJournal});
        }
     });
});





module.exports = router;