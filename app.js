// ----------------------------------------------
//                   DEPENDENCIES
// ----------------------------------------------

var express = require("express");
var app = express();

app.set("view engine", "ejs");

// ----------------------------------------------
//                   ROUTES
// ----------------------------------------------

app.get("/", function(req,res){
    res.render("home");
});

app.get("/campgrounds", function(req,res){
    var campgrnds = [
        {name: "Deep Creek", image: "https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144295f8c67ba0e9b1_340.jpg"},
        {name: "Borough Huts", image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"},
        {name: "Mt Stapylton", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f0c97ea5eab1bc_340.jpg"},
        {name: "Joker's Flat", image: "https://farm9.staticflickr.com/8457/7930235502_df747573ca.jpg"},
        {name: "Tidal River", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"}
        ];
    
    res.render("campgrounds", {sites: campgrnds});
});

// ----------------------------------------------
//                   SERVER
// ----------------------------------------------

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running...");
});