var express     = require("express"),
    router      = express.Router(),
    // Mongoose models
    Campground = require("../models/campground");

// INDEX - Show the listing of all the campgrounds
router.get("/", function(req,res){
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
router.get("/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

// CREATE - Create an entry in the database for a new campground
router.post("/", isLoggedIn, function(req,res){
    // get data from form and build new object
    var newCampgnd = {
        name: req.body.name,
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
            } else {
                // redirect back to campgrounds page
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
        } else {
            // show the campground details page
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT
router.get("/:id/edit", isLoggedIn, function(req,res){
    // Retrieve the campground information from the DB
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log("/");
        } else {
            // Render the form
            res.render("campgrounds/edit", {campground: campground});
        };
    });
})

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


module.exports = router;