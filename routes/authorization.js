require("dotenv").config();
var express           =   require("express");
var router            =   express.Router();
var User              =   require("../models/User");
var passport          =   require("passport");
var async             =   require("async");
var nodemailer        =   require("nodemailer");
var crypto            =   require("crypto");
var validator         =   require("express-validator");
var { isLoggedIn }    =   require('../middleware');

//REGISTER
router.get("/register",(req,res) => {res.render("register.ejs")});
router.post('/register', function(req, res,next) { 
  newUser = new User({firstname: req.body.firstname,lastname:req.body.lastname,username: req.body.username, email: req.body.email,phonenumber: req.body.phonenumber});
  User.register(newUser, req.body.password, function(err, user) { 
          if (err) { 
            console.log(err); 
          }else{ 
              console.log(user);
              async.waterfall([
                function(done) {crypto.randomBytes(20, function(err, buf) {var token = buf.toString('hex');done(err, token);});},
                function(token, done) {
                  User.findOne({ email: req.body.email }, function(err, user) {
                    if (err) {
                      console.log(err);
                    return res.redirect('/register');
                    }
                    user.verificationToken = token;
                    user.verificationTokenExpires = Date.now() + 10800000; // 3 hour
                    user.save(function(err) {
                    done(err, token, user);
                    });
                  });
                  },
                  function(token, user, done) {
                    var smtpTransport = nodemailer.createTransport({
                      service: 'Gmail', 
                      auth: { user: 'hiimanurag122@gmail.com',pass: process.env.GMAILPW }});
                    var mailOptions = {
                      to: user.email,
                      from: 'hiimanurag122@gmail.com',
                      subject: 'DailyLife Account Verification',
                      text: 'Please click on the following link, to verify your account: \n\n' +
                        'http://' + req.headers.host + '/verify/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your account will not be created.\n'
                      };
                      smtpTransport.sendMail(mailOptions, function(err) {
                        console.log('mail sent');
                        console.log('success An e-mail has been sent to ' + user.email + ' with further instructions.');
                      done(err, 'done');
                      });
                    }
                    ],function(err) {
                      if (err) return next(err);
                      res.redirect('/register');
                      });
                    }
                      });
           
        });


router.get('/verify/:token',function(req, res) {
  User.findOne({ verificationToken: req.params.token, verificationTokenExpires: { $gt: Date.now() } }, function(err, user){
  if (!user) {console.log('Password reset token is invalid or has expired.Cant find User for this token');} 
  else{ 
  user.isVerified = true;
  user.save(function (err) {if (err) { return res.status(500).send({ msg: err.message }); }});
  console.log(user);
  res.redirect('/login');
      }
    });
  });


//LOGIN

router.get("/login",(req,res) => {res.render("login.ejs")});

router.post("/login", passport.authenticate('local', { //successRedirect: '/',
failureRedirect: '/login' }),
function(req,res){
  User.findOne({username:req.body.username},function(err,user){
    if(err) console.log(err);
    else if (!user) {console.log('error'+"User not found!"); return res.redirect("/login");}
    else {console.log(user);
      if(user.isVerified)
      {
        res.redirect(req.session.returnTo || '/user/'+user._id);
      }
      else { console.log("Please verify your account first"); res.redirect("login");}
    }
  })
})

//LOGOUT
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect("/");
});

//FORGOT PASS:
router.get('/forgot',(req, res) => {res.render('forgotpass.ejs')});

router.post('/forgot', function(req, res, next) {
	async.waterfall([
	  function(done) { crypto.randomBytes(20, function(err, buf) {var token = buf.toString('hex');done(err, token);});},
	  function(token, done) {
		User.findOne({ email: req.body.email }, function(err, user) {
		  if (!user) {
      console.log('error No account with that email address exists.');
			return res.redirect('/forgot');
		  }
		  user.resetPasswordToken = token;
		  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		  user.save(function(err) {
			done(err, token, user);
		  });
		});
	  },
	  function(token, user, done) {
		var smtpTransport = nodemailer.createTransport({
		service: 'Gmail', auth: { user: 'hiimanurag122@gmail.com',pass: process.env.GMAILPW } });
		var mailOptions = {
			to: user.email,
			from: 'hiimanurag122@gmail.com',
			subject: 'DailyLife Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		  };
		  smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        console.log('success An e-mail has been sent to ' + user.email + ' with further instructions.');
			  done(err, 'done');
		  });
		}], function(err) {
		if (err) return next(err);
		res.redirect('/forgot');
	  });
    });

///RESET PASSWORD
router.get('/reset/:token', function(req, res) {
User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
if (!user) { req.flash("error",'Password reset token is invalid or has expired.'); return res.redirect('/forgot');}
res.render('resetpass.ejs', {token: req.params.token});
    });
});


router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) { console.log('Password reset token is invalid or has expired.'); return res.redirect('back'); }
          if(req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save(function(err) {
                // req.logIn(user, function(err) {
                //   done(err, user);
                // });
                done(err,user);
                res.redirect('/login');
              });
            })
          } else { req.flash("error", "Passwords do not match."); return res.redirect('back');}
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', auth: { user: 'hiimanurag122@gmail.com', pass: process.env.GMAILPW } });
        var mailOptions = {
          to: user.email,
          from: 'hiimanurag122@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Your password has been changed.');
          done(err);
        });
      }], function(err) {
      res.redirect('/login');
    });
  });

module.exports = router;