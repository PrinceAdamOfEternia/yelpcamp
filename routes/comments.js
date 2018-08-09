var express     = require("express"),
    router      = express.Router(),
    // Mongoose models
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

// INDEX

// NEW
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});    
        }
    });
});

// CREATE
router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }                
            });
        }
    });
});

// SHOW

// EDIT

// UPDATE

// DESTROY

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