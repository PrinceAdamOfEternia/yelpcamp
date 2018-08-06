// ----------------------------------------------
//                   DEPENDENCIES
// ----------------------------------------------

    // packages
var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    app         = express(),
    // Mongoose models
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    // Other
    seedDB      = require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

seedDB();

// ----------------------------------------------
//                   MongoDB CONFIG
// ----------------------------------------------

mongoose.connect("mongodb://localhost/yelpcamp");

// ----------------------------------------------
//                   VARIABLES
// ----------------------------------------------


        
// ----------------------------------------------
//                  CAMPGROUND ROUTES
// ----------------------------------------------

app.get("/", function(req,res){
    res.render("home");
});

// INDEX - Show the listing of all the campgrounds
app.get("/campgrounds", function(req,res){
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
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

// CREATE - Create an entry in the database for a new campground
app.post("/campgrounds", function(req,res){
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
app.get("/campgrounds/:id", function(req,res){
    // retrieve the campground object from the database
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err)
        } else {
            // show the campground details page
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT

// UPDATE

// DESTROY

// ----------------------------------------------
//                  COMMENT ROUTES
// ----------------------------------------------

// INDEX

// NEW
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});    
        }
    })
})

// CREATE
app.post("/campgrounds/:id/comments", function(req,res){
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
            })
        }
    })
})

// SHOW

// EDIT

// UPDATE

// DESTROY


// ----------------------------------------------
//                   SERVER
// ----------------------------------------------

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running...");
});