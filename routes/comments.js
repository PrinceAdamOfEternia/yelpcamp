var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    // Mongoose models
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
    
var middleware = require("../middleware");
    
// INDEX - not required as displayed on campground show pages

// NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});    
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/campgrounds/" + req.params.id);
                } else {
                    var author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    comment.author = author;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/"+campground._id);
                }                
            });
        }
    });
});

// SHOW - not used

// EDIT
router.get("/:comment_id/edit", middleware.commentIsOwnedByUser, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.commentIsOwnedByUser, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else{
            req.flash("success", "Comment updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:comment_id", middleware.commentIsOwnedByUser, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully removed");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// return value
module.exports = router;