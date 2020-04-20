var express = require("express"),
    router = express.Router({mergeParams:true});
//================\\
// COMMENT ROUTES \\ 
//================\\

//ADD a new comment
router.get("/new",function(req,res){
    res.render("comments/new");
});

router.post("/new",function(req,res){
    res.redirect("/new");
})
//EDIT your comment
router.get("/edit",function(req,res){
    res.render("comments/edit");
})
//Save updated comment
router.put("/:co",function(req,res){
    res.redirect("landing");
})
//DELETE comment
router.delete("/:co",function(req,res){
    res.redirect("landing");
})

module.exports = router;