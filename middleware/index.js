var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

// middleware function to check whether the user is already logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be signed in to do that");
    res.redirect("/login");
};

// middleware to check whether the logged in user owns the campground
middlewareObj.campgroundIsOwnedByUser = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash("error", "Only the owner of a campground can do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be signed in to do that");
        res.redirect("/login");
    }
};

// middleware to check whether the logged in user owns the campground
middlewareObj.commentIsOwnedByUser = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash("error", "Only the owner of a comment can do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be signed in to do that");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;