var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    isVerified:{
        type:Boolean,
        default:false,
    },
    registerToken:{
        type:String,
    },
    username:{
        type:String,
    },
    accountType:{
        type:String
    },
    company:{
        type:String
    },
    companyCode:{
        type:String
    },
    role:{
        type:String
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    admin:   {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    twitter:{
        type:String
    },
    facebook:{
        type:String
    },
    instagram:{
        type:String
    },
    linkedIn:{
        type:String
    },
    dribble:{
        type:String
    },
    profilePhoto:{type:String},

});

User.plugin(passportLocalMongoose,{usernameField:'email'});


module.exports = mongoose.model('User', User);