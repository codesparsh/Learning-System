var express = require('express');
var adminRouter = express.Router();
var multer  = require('multer');
var multerS3 = require('multer-s3');
const Course = require('../models/course');
const Categories = require('../models/categories');
const AWS = require('aws-sdk');
const { getVideoDurationInSeconds } = require('get-video-duration')

const ID = 'AKIAJKJMROFNQ636I2MA';
const SECRET = '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';
const BUCKET_NAME = 'udema2';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

var storage = multer.diskStorage({
  destination: process.cwd()+'/public/images/uploads',
  filename: function(req,file,cb){
          console.log(file.originalname);             
          cb(null,file.originalname);
  }
});
var upload = multer({storage:storage});
// var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: BUCKET_NAME,
//     key: function (req, file, cb) {
//       cb(null,file.originalname)
//     }
//   })
// });
var cpUpload = upload.fields([{ name: 'coursePicture', maxCount: 1 } ,{ name: 'video',maxCount:10}])

adminRouter.get('/', function(req, res, next) {
  res.render('admin/index',{layout:'layouts/admin'});
});

function removeDuplicates(data){
  return data.filter((value,index)=>data.indexOf(value)==index);
}


adminRouter.route('/add-listing')
.get(function(req, res, next) {
  Categories.find({})
  .then((categories)=>{
    res.render('admin/add-listing',{layout:'layouts/admin',categories:categories});
  })
})
.post(cpUpload,(req,res,next)=>{
  Course.create({
    title:req.body.titleMain,
    type:req.body.type,
    teacherName:req.body.teacherName,
    coursePicture:req.files['coursePicture'][0].filename,
    courseDescription: req.body.courseDescription,
    category:req.body.category,
    itemTitle: req.body.itemTitle,
    itemDescription:req.body.itemDescription,
    modules:removeDuplicates(req.body.videoCategory),
    videoTitle:req.body.videoTitle,
    videoCategory:req.body.videoCategory
  })
  .then((course)=>{
    for(var i=0;i<=req.files['video'].length-1;i++){
      course.videoName.push(req.files['video'][i].filename)
    }
    course.save()
    .then(()=>{
      Reviews.create({courseId:course.id})
      .then(()=>{
        res.redirect('/admin/courses');
  
      })
    })
  })
})

adminRouter.route('/categories')
.get((req, res, next)=> {
  Categories.find({})
  .then((categories)=>{
    res.render('admin/categories',{layout:'layouts/admin',categories:categories});
  })
})
.post(upload.single('image'),(req, res, next)=> {
  Categories.create({category:req.body.category,image:req.file.filename})
  .then((category)=>{
    res.redirect('/admin/categories');
    next;
  })
});

adminRouter.route('/categories/delete/:categoryId')
.get((req, res, next)=> {
  Categories.findByIdAndDelete(req.params.categoryId)
  .then((categories)=>{
    res.redirect('/admin/categories');
    next;
  })
})

adminRouter.route('/courses')
.get((req, res, next)=> {
  Course.find({})
  .then((courses)=>{
    res.render('admin/courses',{layout:'layouts/admin',courses:courses});
  })
});

adminRouter.route('/courses/approve/:courseId')
.get((req,res,next)=>{
  Course.findByIdAndUpdate(req.params.courseId,{$set:{approved:true}})
  .then(()=>{
    res.redirect('/courses')
    next
  })
})

adminRouter.route('/courses/delete/:courseId')
.get((req,res,next)=>{
  Course.findByIdAndDelete(req.params.courseId)
  .then(()=>{
    res.redirect('/admin/courses')
    next
  })
})


adminRouter.get('/bookmarks', function(req, res, next) {
  res.render('admin/bookmarks',{layout:'layouts/admin'});
});

adminRouter.get('/charts', function(req, res, next) {
  res.render('admin/charts',{layout:'layouts/admin'});
});


adminRouter.get('/messages', function(req, res, next) {
  res.render('admin/messages',{layout:'layouts/admin'});
});

adminRouter.get('/reviews', function(req, res, next) {
  res.render('admin/reviews',{layout:'layouts/admin'});
});

adminRouter.get('/tables', function(req, res, next) {
  res.render('admin/tables',{layout:'layouts/admin'});
});

adminRouter.get('/teacher-profile', function(req, res, next) {
  res.render('admin/teacher-profile',{layout:'layouts/admin'});
});

adminRouter.get('/user-profile', function(req, res, next) {
  res.render('admin/user-profile',{layout:'layouts/admin'});
});


module.exports = adminRouter;
