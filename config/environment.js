const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const development = {
    name :'development',
    asset_path:'./assets',
    session_cookie_key :'hhdbhjhwehcghwECVhwgchvWCSVHgscd',
    db:'trackifyme_development',
    smtp:{
        service:'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure: false,
        auth:{
            user:'saumyalearnsdevelopment@gmail.com',
            pass:'ghghg'
             }
        },
    
        google_client_id:"462792517461-t2urnr192kot1qkfu47r4ri67no8tuu0.apps.googleusercontent.com",

        google_client_secret:"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",

        google_call_back_url:"http://localhost:8005/users/auth/google/callback",
        morgan:{
            mode:'dev',
            options:{stream: accessLogStream}

        }
    
}

const production = {
    name :'production',
    asset_path:process.env.TRACKIFYME_ASSET_PATH,
    session_cookie_key :process.env.TRACKIFYME_SESSION_COOKIE_KEY,
    db:process.env.TRACKIFYME_DB,
    smtp:{
        service:'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure: false,
        auth:{
            user:process.env.TRACKIFYME_SMTP_AUTH__USER,
            pass:process.env.TRACKIFYME_SMTP_AUTH_PASS
             }
        },
    
        google_client_id:process.env.TRACKIFYME_GOOGLE_CLIENT_ID,

        google_client_secret:process.env.TRACKIFYME_GOOGLE_CLIENT_SECRET,
        google_call_back_url:process.env.TRACKIFYME_GOOGLE_CALLBACK_URL,
        morgan:{
            mode:'combined',
            options:{stream: accessLogStream}

        }
}
// module.exports = development;
module.exports = eval(process.env.TRACKIFYME_ENVIRONMENT)== undefined ? development:eval(process.env.TRACKIFYME_ENVIRONMENT);