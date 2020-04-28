var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    User        = require("../models/User"),
    Article     = require("../models/article")
//================\\
// ARTICLE ROUTES \\ 
//================\\



//Index route to show all articles
router.get("/user/:id/article",function(req,res){
    User.findById(req.params.id).populate("article").exec(function(err, user){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("article/index",{user: user});
        }
    });
});


//ADD a new article
router.get("/user/:id/article/new",function(req,res){
    User.findById(req.params.id,function(err,user){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("article/new",{user: user});
        }
    })
})

//CREATE a new article and add to database
router.post("/user/:id/article",function(req,res){
    User.findById(req.params.id, function(err, userFound){
        if(err)
        {
            res.redirect("/user");
        }
        else
        {
            Article.create(req.body.article,function(err, article){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    article.title = req.body.articleTitle;
                    article.image = req.body.articleImage;
                    article.text = req.body.articleText;
                    article.author.id = req.params.id;
                    article.author.username = userFound.username;
                    article.save();
                    console.log(article);
                    userFound.article.push(article);
                    userFound.save();
                    res.redirect('/user/' + req.params.id + "/article");

                }
            })
        }

    })
})



//EDIT journal
router.get("/user/:id/article/:article_id/edit", function(req, res){
    Article.findById(req.params.article_id, function(err, foundArticle){
       if(err){
           res.redirect("back");
       } else {
         res.render("article/edit", {user_id: req.params.id, article: foundArticle});
       }
    });
 });


 // UPDATE journal
router.put("/user/:id/article/:article_id", function(req, res){
    Article.findByIdAndUpdate(req.params.article_id, req.body.article, function(err, updatedArticle){
       if(err){
           res.redirect("back");
       } else {
           res.redirect('/user/' + req.params.id + "/article");
       }
    });
 });


//SHOW Article
router.get("/user/:id/article/:article_id",function(req,res){
    Article.findById(req.params.article_id, function(err, foundArticle){
        if(err){
            res.redirect("back");
        } else {
          res.render("article/show", {user_id: req.params.id, article: foundArticle});
        }
     });
});

module.exports = router;