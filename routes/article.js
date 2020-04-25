var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    User        = require("../models/User"),
    article     = require("../models/article"),
    middleware  = require("../middleware");
//================\\
// ARTICLE ROUTES \\ 
//================\\

//ADD a new article
router.get("/new",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            res.redirect("back");
        }else{
            res.render("article/new");
        }
    })
})

//CREATE a new article
router.post("/new",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            res.redirect("back");
        }else{
            //I will do tommorow - 23rd april
        }
    });
})

module.exports = router;