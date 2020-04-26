var express    = require("express"),
    router     = express.Router(),
    article    = require("../models/article"),
    comment    = require("../models/comments"),
    middleWare = require("../middleware/index");   

//================\\
// COMMENT ROUTES \\ 
//================\\

//ADD a new comment
router.get("/new",function(req,res){
    res.render("../views/comments/new.ejs")
})
router.get("/new",function(req,res){
    article.findById(req.params.id,function(err,article){
        if(err){
            router.redirect("back");
        }else{
            router.render("comments/new",{article:article});
        }
    })
});

//CREATE a comment
router.post("/new",function(req,res){
    article.findById(req.params.id,function(err,article){
        if(err){
            res.redirect("back");
        }else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong");
                console.log(err);
                }
                else{
                    //add username and id to it before saving to database
                    comment.author.id = req.user._id;
                    comment.author.username =  req.user.username;
                    comment.save(); 
                    article.comments.push(comment);
                    article.save();
                    console.log(comment);
                    req.flash("success","Comment successfully posted");
                    res.redirect("/article/" + article._id); //redirect to its show page
                }
            });
           
        }
    });
})
//EDIT your comment
router.get("/:comment_id/edit",function(req,res){
    comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{foundComment:foundComment});
        }
    });
});

//Save updated comment
router.put("/:comment_id",function(req,res){
    comment.findByIdAndUpdate(req.params.id,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/article/" + updatedComment._id);
        }
    });
})

//DELETE comment
router.delete("/:comment_id",function(req,res){
    comment.findByIdAndDelete("req.params.id",function(err,commentDel){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/article/"+commentDel._id);
        }
    });
})

module.exports = router;