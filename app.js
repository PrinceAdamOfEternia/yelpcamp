// ----------------------------------------------
//                   DEPENDENCIES
// ----------------------------------------------

var express = require("express");
var app = express();

app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelpcamp");

// ----------------------------------------------
//                   MongoDB CONFIG
// ----------------------------------------------

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// ----------------------------------------------
//                   VARIABLES
// ----------------------------------------------


        
// ----------------------------------------------
//                   ROUTES
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
            res.render("index", {sites: campgrnds});
        }
    });
});

// UPDATE - Create an entry in the database for a new campground
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

// NEW - show the form for adding a new campground to the database
app.get("/campgrounds/new", function(req,res){
    res.render("new");
});

//SHOW - show the page for detailed information about a specific campsite
app.get("/campgrounds/:id", function(req,res){
    // retrieve the campground object from the database
    var campground = Campground.findByID(req.params.id);
    // show the campground details page
    res.render("show", {campground: campground});
});

// ----------------------------------------------
//                   SERVER
// ----------------------------------------------

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running...");
});