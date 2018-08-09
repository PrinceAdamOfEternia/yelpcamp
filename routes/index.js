var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    // Mongoose models
    User = require("../models/user");

router.get("/", function(req,res){
    res.render("home");
});

// ----------------------------------------------
//                  AUTH ROUTES
// ----------------------------------------------

// REGISTER
router.get("/signup", function(req,res){
    res.render("signup");
});

router.post("/signup", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN
router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/"
    }),
function(req,res){
});

// LOGOUT
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

// ----------------------------------------------
//                   FUNCTIONS
// ----------------------------------------------

// middleware function to check whether the user is already logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// return value
module.exports = router;