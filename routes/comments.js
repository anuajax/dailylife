var express    = require("express"),
    router     = express.Router(),
    comment    = require("../models/comments"),
    middleWare = require("../middleware/index"),  
    router     = express.Router({mergeParams:true}),
    Article    = require("../models/article"),
    Comment    = require("../models/comments"),
    User       = require("../models/User");


//================\\
// COMMENT ROUTES \\ 
//================\\

//ADD a new comment

router.get("/user/:id/article/:article_id/comments/new",function(req,res){
    Article.findById(req.params.article_id,function(err,article){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/new",{user_id:req.params.id,article:article});
        }
    })
});

//CREATE a comment
router.post("/new",function(req,res){
    Article.findById(req.params.id,function(err,article){
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
        if(err) { res.redirect("back"); }
        else res.render("comments/edit",{foundComment:foundComment});
        });
    });

router.post("/user/:id/article/:article_id/comments",function(req,res){
    User.findById(req.params.id,function(err, userFound){
        if(err)
        {
            res.redirect("/");
        }
        else
        {
            Article.findById(req.params.article_id, function(err, articleFound){
                if(err)
                {
                    res.redirect("/");
                }
                else
                {
                    console.log(articleFound);
                    Comment.create(req.body.comment,function(err, comment){
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            comment.text = req.body.commentText;
                            comment.author.id = req.params.id;
                            comment.author.username = userFound.username;
                            comment.save();
                            console.log(comment);
                            console.log(articleFound);
                            articleFound.comment.push(comment);
                            articleFound.save();
                            res.redirect('/user/' + req.params.id + "/article");

                        }
                    })
                }

            })
        }
    })
        
})


//EDIT comment
router.get("/user/:id/article/:article_id/comments/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
         res.render("comments/edit", {user_id: req.params.id, article_id: req.params.article_id, comment:foundComment});
       }
    });
 });

 // UPDATE comment
 router.put("/user/:id/article/:article_id/comments/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
           res.redirect('/user/' + req.params.id + "/article");
       }
    });
 });





// //Save updated comment
// router.put("/comments/:comment_id",function(req,res){
//     comment.findByIdAndUpdate(req.params.id,function(err,updatedComment){
//         if(err){
//             res.redirect("back");
//         }else{
//             res.redirect("/article/" + updatedComment._id);
//         }
//     });
// })

// //DELETE comment
// router.delete("/comments/:comment_id",function(req,res){
//     comment.findByIdAndDelete("req.params.id",function(err,commentDel){
//         if(err){
//             res.redirect("back");
//         }else{
//             res.redirect("/article/"+commentDel._id);
//         }
//     });
// })

module.exports = router;