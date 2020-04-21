var express     =   require("express");
var router      =   express.Router();
var User        =   require("../models/User");
var passport    =   require("passport");


//REGISTER
router.get("/register",(req,res) => {res.render("register.ejs")});

router.post("/register",function(req,res){
    var NewUser = new User({username: req.body.username, email: req.body.email, phonenumber: req.body.phonenumber});
    User.register(NewUser,req.body.password,(err,user) => {
        if(err)
        return res.render("register.ejs");
        else
        console.log(`${user.username} is registered`);
        passport.authenticate("local")(req, res, () => res.redirect("/"));
    });
});

//LOGIN
router.get("/login",(req,res) => {res.render("login.ejs")});

router.post("login",passport.authenticate("local",{
//successRedirect : "/",
failureRedirect: "/login"}),
function(req,res){
	res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

//LOGOUT
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;