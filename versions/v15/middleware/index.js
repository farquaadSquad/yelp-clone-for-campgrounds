var Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    User            = require("../models/user");

var middlewareObj={}

middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error","You need to login first");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership=function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found.");
            res.redirect("back");
        } else {
            // Check if foundCampground exists,the bug could ahppen if user tampers with url
            
            
            // does user own the campground
            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin ){
                //render edit template with that campground
                // res.render("campgrounds/edit", {campground: foundCampground});
                next();
            }
            // console.log(foundCampground.author.id);// is a mongoose object
            // console.log(req.user._id);// is a string
            else {
                req.flash("error","You don't have permissions to do that");
                res.redirect("back");
            }
        }
    });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
        // take the user back from the page they came from
    }
}



middlewareObj.checkCommentOwnership=function(req, res, next){
        if (req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err, foundComment){
                if(err || !foundComment){
                    console.log(err);
                    req.flash("error","Comment not found.");
                    res.redirect("back");
                } else {
                    
                    
                    // does user own the comment
                    if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    }
                    else {
                        req.flash("error","You don't have permissions to do that");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("error","You need to be logged in to do that");
            res.redirect("back");
            // take the user back from the page they came from
        }
}
middlewareObj.isSafe = function(req, res, next) {
    if(req.body.image && req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/) ) {
        next();
    }else {
        req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
        res.redirect('back');
    }
};
middlewareObj.isSafePut =function(req, res, next) {
    if(req.body.campground && req.body.campground.image && req.body.campground.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
        next();
    }else {
        req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
        res.redirect('back');
    }
};

module.exports = middlewareObj;