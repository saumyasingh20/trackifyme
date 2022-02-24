//importing the user schema from models/user
const User = require('../models/user');
const fs = require('fs');
const signUpMailer = require('../mailers/sign_up_mail');
const updatePasswordMailer = require('../mailers/update_password_mail');
const bcrypt = require('bcrypt');

//reender the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_up',{
        title:"Sign Up"
    });
};
//reender the sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
 
    return res.render('user_sign_in',{
        title:"Sign In"
    });
};
module.exports.create =function(req,res){
    //step 1 check whether password and confirm password have same value, if yes then create that user in the db(if it doesnt exist already in the db) 
   
    if(req.body.password != req.body.confirm_password){
        console.log('password not confirmed');
        req.flash('error','password and confirm password fields do not match');
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error','error in finding user in sign up process');
            return;
        }
 
        if(!user){
         console.log("user doesn't exist so create user in db");
            User.create(req.body,function(err,user){
             if(err){
                 req.flash('error','error in creating user in sign up process');
                 return;
             }
             signUpMailer.sendWelcomeMail(user);
             req.flash('success','Sign Up Successful !');
           
             return res.redirect('/users/sign-in');
            });
        }else{
         req.flash('error','User Account already exists , please try signing in');
         return res.redirect('/users/sign-in');
        }
    })
 
 
 
 }

 module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully !');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have been logged out');
    return res.redirect('/');
}
module.exports.renderUpdatePasswordForm = function(req,res){
    return res.render('update_password_form',{
        title:"Update Password"
    });
}
module.exports.updateUserPassword = function(req,res){
    let signedInUser = req.user;

    if(req.body.new_password != req.body.confirm_password){
        req.flash('error','New Password and Confirm password fields do not match');
        console.log("password and confirm password dont match");
        return res.redirect('back');    
    }
    bcrypt.compare(req.body.old_password, signedInUser.password, function (err, result) {
        if (result == true) {
            signedInUser.password=req.body.new_password;
            signedInUser.save();
            req.flash('success','Password updated successfully !');
            updatePasswordMailer.sendPasswordUpdateMail(signedInUser);
            return res.redirect('/');
                
            } else {
                req.flash('error','Previous Password is incorrect');
                return res.redirect('back');
                }
        });

   
}

