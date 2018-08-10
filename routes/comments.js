var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    // Mongoose models
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
    
// INDEX

// NEW
router.get("/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});    
        }
    });
});

// CREATE
router.post("/", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    var author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    comment.author = author;
                    comment.save();
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