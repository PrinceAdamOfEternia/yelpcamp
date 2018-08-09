// ----------------------------------------------
//                   DEPENDENCIES
// ----------------------------------------------

    // packages
var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    // Authentication packages
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    // Mongoose models
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    // Other
    seedDB          = require("./seeds");
    
//routes
var campgroundRoutes = require("./routes/campground"),
    commentRoutes    = require("./routes/comment"),
    indexRoutes      = require("./routes/user")

// =============== ENABLE DB ====================
mongoose.connect("mongodb://localhost/yelpcamp");

// =============== CONFIG APP ===================
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// Set up for user authentication
app.use(require("express-session")(
    {
        secret: "This is the YelpCamp secret",
        resave: false,
        saveUninitialized: false
    }
));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Provide the currentUser to all views (uses middleware)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// Add in the routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

// Seed the database for testing
seedDB();

// ----------------------------------------------
//                   SERVER
// ----------------------------------------------

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running...");
});