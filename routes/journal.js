var express = require("express");
var router = express.Router({mergeParams:true});
var User = require("../models/User");
var Journal =  require("../models/journal");

//Index route to show all routes
router.get("/user/:id/journal",function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("journal/index",{user: user});
        }
    }
)})

//New Journal
router.get("/user/:id/journal/new", function(req,res){
	User.findById(req.params.id, function(err, user){
        if(err)
        {
            console.log(err);
        }
        else
        {
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
                journal.author.id = req.user._id;
                journal.author.username = req.user.username;

                journal.save();
                userFound.journals.push(journal);
                userFound.save();
                res.redirect('/user');
            })
        }

    })
});





module.exports = router;