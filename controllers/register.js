var nodemailer = require("nodemailer");
var express = require('express');
var User = require('../models/user');
var registerRoute = express.Router();
var passport = require('passport');
const dotenv = require('dotenv').config();


var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "snowmansparsh4@gmail.com",
      pass: process.env.EMAIL_PASS
  }
});

var mailOptions,host,link;
let rand;
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 

registerRoute.route('/')
.get((req,res)=>{
    res.render('user/register',{layout:'layouts/plain'})
})
.post(function(req,res,next){
    rand=makeid(12);
    host=req.get('host');
    link="http://"+req.get('host')+"/register/verify?id="+rand;
    mailOptions={
    to : req.body.email,
    subject : "Please confirm your Email account",
    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
            console.log(error);
            res.end("error");
    }else{
            console.log("Message sent: " + response.message);
            User.register({ firstName: req.body.firstName, lastName:req.body.lastName, accountType:req.body.accountType, 
                company:req.body.company, companyCode:req.body.companyCode, role:req.body.role,
                email: req.body.email, registerToken: rand }, req.body.password, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render('register');
                } else {
                    passport.authenticate('local')(req, res, function () {
                        res.send('/');
                    });
                }
            })
        }
    }); 
})


registerRoute.route('/verify')
.get(function(req,res){
  console.log(req.protocol+":/"+req.get('host'));
      console.log("Domain is matched. Information is from Authentic email");

        User.findOneAndUpdate({ registerToken: req.query.id }, { $set: { isVerified: true } }, (err, user) => {
            if(!err){
                if(user){
                    res.redirect('/');
                }else if(!user){
                    res.send('invalid email')
                }
            }
            if (err) console.log("Something wrong when updating data!");

        });

})


module.exports = registerRoute;
