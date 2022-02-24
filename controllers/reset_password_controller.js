const ResetPasswordToken = require('../models/reset_password_token');
const User = require('../models/user');
const crypto = require('crypto');
const updatePasswordMailer = require('../mailers/update_password_mail');
const ResetPasswordLinkMailer = require('../mailers/reset_password_link_mailer');

module.exports.renderEmailForm= async function(req,res){
    try{
        return res.render('reset_password_email',{
            title:"Reset Password"
        })

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.validateUser = async function(req,res){
    try{
        const email = req.body.email;
        
        console.log('email is',email);
        User.findOne({email:email}).exec(function(err,user){
            if(err){console.log('error in finding user to reset password',err);return;}
            if(user){
                 
                ResetPasswordToken.create({
                    user: user,
                    accessToken:crypto.randomBytes(20).toString('hex'),
                    isValid:true
                },function(err,resetToken){
                    ResetPasswordLinkMailer.sendResetPasswordLink(resetToken,user);
                    req.flash('success'," A link to reset your password has been sent on your registered email!");
                    return res.redirect('/users/sign-in');
                });
               
            }else{
                req.flash('error','Oops ! No account exists with this email, please sign up');
                return res.redirect('/users/sign-up');
            }

        })
        

    }catch(err){
        console.log("error in validating user",err);
    }
}
module.exports.renderResetPasswordForm = async function(req,res){
    let token = req.params.token;

    ResetPasswordToken.findOne({accessToken: token}, function(err, token){
        if(err){
            req.flash('error',err);
            console.log("Error in db connections");
            return;
        }

        if(!token){
            return res.send(" <center> <h1> Invalid Access token <h1> </center>");
        }

        if(!token.isValid){
            return res.send("<center> <h1> This Token has expired :/ <h1> </center>");
        }

        return res.render('reset_password_form',{
            title:"Reset Password",
            accessToken: token.accessToken,
        })
    })

}

module.exports.ResetPassword = async function(req,res){
    try{
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        let token = req.body.token;

        if(password !== confirmPassword){
             req.flash('error','Password and Confirm Password should be same');
             return res.redirect('back');
        }

        let resetToken = await ResetPasswordToken.findOne({accessToken: token}).populate('user');
        
        if(!resetToken || !resetToken.user){
            req.flash('error','Reset token is invalid, or no user is associated with this token');
            return res.redirect('back');
            
        }
        resetToken.user.password = password;
        resetToken.isValid = false; 
        resetToken.user.save();
        resetToken.save();
        req.flash('success',"Your password has been changed Successfully !");
        updatePasswordMailer.sendPasswordUpdateMail(resetToken.user);
        return res.redirect('/users/sign-in');

     

    }catch(err){
        console.log("error in resetting password",err);
    }
}