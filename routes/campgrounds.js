var express     = require("express"),
    router      = express.Router(),
    // Mongoose models
    Campground = require("../models/campground");
    
var middleware = require("../middleware");

// INDEX - Show the listing of all the campgrounds
router.get("/", function(req,res){
    // Retrieve all of the campgrounds from the database
    Campground.find({}, function(err, campgrnds){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            // display all of the campgrounds on the main page
            res.render("campgrounds/index", {sites: campgrnds});
        }
    });
});

// NEW - show the form for adding a new campground to the database
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

// CREATE - Create an entry in the database for a new campground
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form and build new object
    var newCampgnd = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.img,
        description: req.body.desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    
    // Add a new campground to the database
    Campground.create(newCampgnd, function(err,newCampgnd){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                // redirect back to campgrounds page
                req.flash("success", "Campground added successfully");
                res.redirect("/campgrounds");
            }
        });
});

//SHOW - show the page for detailed information about a specific campsite
router.get("/:id", function(req,res){
    // retrieve the campground object from the database
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            // show the campground details page
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.campgroundIsOwnedByUser, function(req,res){
    // Retrieve the campground information from the DB
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            // Render the form
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// UPDATE
router.put("/:id", middleware.campgroundIsOwnedByUser, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Campground updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.campgroundIsOwnedByUser, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Campground successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;