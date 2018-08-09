var express     = require("express"),
    router      = express.Router(),
    // Mongoose models
    Campground = require("../models/campground");

// INDEX - Show the listing of all the campgrounds
router.get("/campgrounds", function(req,res){
    // Retrieve all of the campgrounds from the database
    Campground.find({}, function(err, campgrnds){
        if(err){
            console.log(err);
        } else {
            // display all of the campgrounds on the main page
            res.render("campgrounds/index", {sites: campgrnds});
        }
    });
});

// NEW - show the form for adding a new campground to the database
router.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

// CREATE - Create an entry in the database for a new campground
router.post("/campgrounds", function(req,res){
    // get data from form and build new object
    var newCampgnd = {
        name: req.body.name,
        image: req.body.img,
        description: req.body.desc
    };
    
    // Add a new campground to the database
    Campground.create(newCampgnd, function(err,newCampgnd){
            if(err){
                console.log(err);
            } else {
                // redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
        });
});

//SHOW - show the page for detailed information about a specific campsite
router.get("/campgrounds/:id", function(req,res){
    // retrieve the campground object from the database
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
        } else {
            // show the campground details page
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT

// UPDATE

// DESTROY


module.exports = router;