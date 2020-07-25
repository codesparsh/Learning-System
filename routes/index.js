var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
const Course = require('../models/course');
var Categories = require('../models/categories');
var Reviews = require('../models/reviews');
var passport = require('passport');
const { getVideoDurationInSeconds } = require('get-video-duration')

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
.get(function(req, res, next) {
  Categories.find({})
  .then((categories)=>{
    res.render('user/index',{categories:categories});
  })
});

router.route('/login')
.get(function(req, res, next) {
  res.render('user/login',{layout:'layouts/plain'});
})
.post((req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      res.redirect(req.get('referer'))
    }
    console.log(user.password);
    if(user.isVerified == false){
      res.redirect(req.get('referer'))
    }

    req.login(user, function(err){
      if(err){
        return next(err);
      }
      req.session.loggedin = true;
      res.statusCode = 200;
      res.redirect('/');
      next;        
    });
  })(req, res,next);
})

router.route('/logout')
.get((req, res) => {
  if (req.session) {
    req.session.loggedin = false;
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.route('/dashboard')
.get(function(req, res, next) {
  res.render('user/dashboard',{layout:'layouts/dash'});
});

router.route('/bookmarks')
.get(function(req, res, next) {
  res.render('user/bookmarks',{layout:'layouts/dash'});
});

router.route('/messages')
.get(function(req, res, next) {
  res.render('user/messages',{layout:'layouts/dash'});
});

router.route('/courses')
.get(function(req, res, next) {
  res.render('user/courses',{layout:'layouts/dash'});
});

router.route('/reviews')
.get(function(req, res, next) {
  res.render('user/reviews',{layout:'layouts/dash'});
});

router.route('/profile')
.get(function(req, res, next) {
  res.render('user/user-profile',{layout:'layouts/dash'});
});

// From a local path...
// function getDuration(data){

//   console.log(data);
  
//   getVideoDurationInSeconds(process.cwd()+`/public/images/uploads/${data}`)
//   .then((duration)=>{
//     return duration
//   })
// }
 
router.route('/course-detail/:courseId')
.get(function(req, res, next) {
  Course.findById(req.params.courseId)
  .then((course)=>{
    Reviews.findOne({courseId:course.id})
    .populate({
      path:'review',
      populate:{
        path:'user',
        model:'User'
      }
    })
    .exec()
    .then((reviews)=>{
      var r1=0,r2=0,r3=0,r4=0,r5=0,avg=0;
      if(reviews.review){
        for(var i=0;i<=reviews.review.length-1;i++){
          if(reviews.review[i].rating==1){
            r1++;
  
          }else if(reviews.review[i].rating==2){
            r2++;
            
          }else if(reviews.review[i].rating==3){
            r3++;
            
          }else if(reviews.review[i].rating==4){
            r4++;
            
          }else if(reviews.review[i].rating==5){
            r5++;
            
          }
          avg+=reviews.review[i].rating;
        }
      }

      var rating={
        r1:(r1/reviews.review.length)*100,
        r2:(r2/reviews.review.length)*100,
        r3:(r3/reviews.review.length)*100,
        r4:(r4/reviews.review.length)*100,
        r5:(r5/reviews.review.length)*100,
        avg:avg/(reviews.review.length*5),
        tot:reviews.review.length,
      }
      course.rating = Math.round(avg/(reviews.review.length*5));
      course.reviews = reviews.review.length;
      course.save()
      .then(()=>{
        res.render('user/course-detail',{course:course,rating:rating,reviews:reviews});
      })
    })
  })
})
.post(function(req, res, next) {
  Reviews.findOneAndUpdate({courseId:req.params.courseId},{$push:{review:{$each:[{user:req.user.id,rating:req.body.rating,comment:req.body.comment}]}}})
  .then((course)=>{
      res.redirect(req.get('referer'));
  })
});


router.route('/courses-list')
.get(function(req, res, next) {
  res.render('user/courses-list');
});



router.route('/courses-grid')
.get(function(req, res, next) {
  Course.find({category:(req.query.category).toString().split('+').join(' ')})
  .then((courses)=>{

    res.render('user/courses-grid',{courses:courses});
  })
});

router.route('/teacher-detail')
.get(function(req, res, next) {
  res.render('user/teacher-detail');
});

router.route('/about')
.get(function(req, res, next) {
  res.render('user/about');
});

router.route('/blog')
.get(function(req, res, next) {
  res.render('user/blog');
});

router.route('/contacts')
.get(function(req, res, next) {
  res.render('user/contacts');
});

router.route('/faq')
.get(function(req, res, next) {
  res.render('user/faq');
});

router.route('/help')
.get(function(req, res, next) {
  res.render('user/help');
});

router.route('/media-gallery')
.get(function(req, res, next) {
  res.render('user/media-gallery');
});

router.route('/pricing-tables')
.get(function(req, res, next) {
  res.render('user/pricing-tables');
});

router.route('/cart-1')
.get(function(req, res, next) {
  res.render('user/cart-1');
});

router.route('/cart-2')
.get(function(req, res, next) {
  res.render('user/cart-2');
});

router.route('/cart-3')
.get(function(req, res, next) {
  res.render('user/cart-3');
});

module.exports = router;
