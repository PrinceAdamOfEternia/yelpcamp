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
router.get("/:id/edit", isOwnedByUser, function(req,res){
    // Retrieve the campground information from the DB
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            // Render the form
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// UPDATE
router.put("/:id", isOwnedByUser, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", isOwnedByUser, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/campgrounds");
        }
    });
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

// middleware to check whether the logged in user owns the campground
function isOwnedByUser(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id)){
                    return next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}


module.exports = router;