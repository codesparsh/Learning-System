var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var course = new Schema({
    approved:{
        type:Boolean,
        default:false
    },
    title:{
        type:String,
    },
    type:{
        type:String,
    },
    teacherName:{
        type:String,
    },
    coursePicture:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    category:{
        type:String,
    },
    itemTitle:[{
        type:String,
    }],
    itemDescription:[{
        type:String,
    }],
    rating:{type:Number,default:0},
    reviews:{type:Number,default:0},
    modules:[{type:String}],
    videoCategory:[{ type:String }],
    videoTitle:[{ type:String }],
    videoName:[{ type:String }],
    videoDuration:[{ type:Number }]

},{
    timestamps:true,
})
const Course = mongoose.model('courses',course);
module.exports = Course;