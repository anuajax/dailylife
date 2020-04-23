var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    user        = require("../models/user"),
    article     = require("../models/article"),
    middleware  = require("../middleware");
//================\\
// ARTICLE ROUTES \\ 
//================\\

//ADD a new article
router.get("/new",middleware.isLoggedIn,function(req,res){
    user.findById(req.params.id,function(err,foundUser){
        if(err){
            res.redirect("back");
        }else{
            res.render("article/new");
        }
    })
})

//CREATE a new article
router.post("/new",middleware.isLoggedIn,function(req,res){
    user.findById(req.params.id,function(err,foundUser){
        if(err){
            res.redirect("back");
        }else{
            //I will do tommorow - 23rd april
        }
    });
})