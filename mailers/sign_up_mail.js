const nodeMailer = require('../config/nodemailer');
exports.sendWelcomeMail =(user) =>{
    let htmlString = nodeMailer.renderTemplate({user:user},'/sign_up_mail.ejs');
    nodeMailer.transporter.sendMail({
        from: 'saumyalearnsdevelopment@gmail.com',
        to: user.email,
        subject:`Welcome to my Authentication App`,
        html: htmlString

    }, (err,info) => {
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        
        console.log('Mail delivered',info);
        return;


    });
}