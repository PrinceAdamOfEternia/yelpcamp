var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

 
var seeds = [
    {
        name: "Cloud's Rest",
        price: "10.00",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        price: "15.00",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        price: "18.00",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    { 
        name: "Borough Huts",
        price: "22.00",
        image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg",
        description: "Sheltered beach side, hike-in campsite"
    },
    { 
        name: "Joker's Flat",
        price: "35.00",
        image: "https://farm9.staticflickr.com/8457/7930235502_df747573ca.jpg",
        description: "Sheltered beach side, hike-in campsite"
    },
    { 
        name: "Tidal River",
        price: "12.30",
        image: "https://kgrahamjourneys.files.wordpress.com/2013/05/006.jpg",
        description: "Sheltered beach side, hike-in campsite"
    },
    { 
        name: "Mt Stapylton",
        price: "16.00",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKPxOuS5Gv6D3acz2j4N86CFqPwB3oONFcd_N_j3FB8VG2Rf8PkQ",
        description: "Sheltered beach side, hike-in campsite"
    },
    { 
        name: "Sealer's Cove",
        price: "12.00",
        image: "https://kgrahamjourneys.files.wordpress.com/2013/05/0082_001.jpg", 
        description: "Sheltered beach side, hike-in campsite"
    }
];

var defComment = {text: "This place is great, but I wish there was internet"};
var defUser = process.env.YCUSER

module.exports = seedDB;

async function seedDB(){
    await Campground.remove({});
    console.log("Campgrounds removed");
    await Comment.remove({});
    console.log("Comments removed");
    console.log("----------------")
    let user = await User.findById(defUser);
    var defAuthor = {
                        id: user._id,
                        username: user.username
                    };
    for(const seed of seeds){
        let campground = await Campground.create(seed);
        console.log("campground added");
        campground.author = defAuthor;
        let comment = await Comment.create(defComment);
        comment.author = defAuthor;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        console.log("comment added");
    }
}
 
// function seedDB(){
//   //Remove all campgrounds
//   Campground.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed campgrounds!");
//         Comment.remove({}, function(err) {
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed comments!");
//             // add a default user
//             // var defAuthor;
//             User.findById("5b6c1beaec1194097ff2e2fc", function(err,user){
//                 if(err){
//                     console.log("ERROR: default user does not exist");
//                 } else {
//                     var defAuthor = {
//                         id: user._id,
//                         username: user.username
//                     };
//                     console.log(defAuthor);
//                     // add a few campgrounds
//                     seeds.forEach(function(seed){
//                         Campground.create(seed, function(err, campground){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 campground.author = defAuthor;
//                                 console.log("added a campground");
//                                 //create a comment
//                                 Comment.create(
//                                     {
//                                         text: "This place is great, but I wish there was internet"
//                                     }, function(err, comment){
//                                         if(err){
//                                             console.log(err);
//                                         } else {
//                                             comment.author = defAuthor;
//                                             comment.save();
//                                             campground.comments.push(comment);
//                                             campground.save();
//                                             console.log("Created new comment");
//                                         }
//                                     });
//                             }
//                         });
//                     });
//                 }
//             });
            
//         });
//     }); 
// }
 
