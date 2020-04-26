var Comment = require("../models/comments");



var middlewareObj={}

middlewareObj.commentOwner = function(res,req,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}



middlewareObj.isLoggedIn = function isLoggedIn(res,req,next){
    if(req.isAuthenticated()){
       return next();
    } 
    res.redirect("/login");
}

module.exports = middlewareObj;