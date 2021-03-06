var express    = require("express"),
    router     = express.Router({mergeParams:true}),
    article    = require("../models/article"),
    comment    = require("../models/comments")

//================\\
// COMMENT ROUTES \\ 
//================\\

//ADD a new comment
router.get("/comments/new",function(req,res){
    article.findById(req.params.id,function(err,article){
        if(err){
            router.redirect("back");
        }else{
            router.render("comments/new",{article:article});
        }
    })
});

//CREATE a comment
router.post("/comments/new",function(req,res){
    article.findById(req.params.id,function(err,article){
        if(err){
            res.redirect("back");
        }else{
            
        }
    });
})
//EDIT your comment
router.get("/comments/:comment_id/edit",function(req,res){
    comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{foundComment:foundComment});
        }
    });
});

//Save updated comment
router.put("/comments/:comment_id",function(req,res){
    comment.findByIdAndUpdate(req.params.id,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/article/" + updatedComment._id);
        }
    });
})

//DELETE comment
router.delete("/comments/:comment_id",function(req,res){
    comment.findByIdAndDelete("req.params.id",function(err,commentDel){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/article/"+commentDel._id);
        }
    });
})

module.exports = router;