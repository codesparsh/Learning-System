var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviews = new Schema({
    review:[{
        user:{ type:Schema.Types.ObjectId , ref:'User' },
        rating:{ type:Number },
        comment:{ type:String },
    }],
    courseId: { type: Schema.Types.ObjectId , ref: 'courses' }, 
},{
    timestamps:true
})

module.exports = mongoose.model('Reviews',reviews);