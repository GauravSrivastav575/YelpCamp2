const {campgroundSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;  //we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo. This enables us to access and use the returnTo value (via res.locals.returnTo) later in the middleware chain so that we can redirect users to the appropriate page after they have logged in.
        
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg,400);
    }else{
     next();
    }
 }

module.exports.isAuthor = async (req,res,next)=>{
  const {id} = req.params;
  const campground =  await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
 }

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg,400);
    }else{
     next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    const review =  await Review.findById(reviewId);
      if(!review.author.equals(req.user._id)){
          req.flash('error','You do not have permission to do that!');
          return res.redirect(`/campgrounds/${id}`);
      }
      next();
}
// module.exports = isLoggedIn;