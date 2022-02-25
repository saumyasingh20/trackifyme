module.exports.home = async function(req,res){
    try{
        return res.render('home',{
            title:"trackifyme | home"
        });
    }catch(err){
        console.log(`error in home controller ${err}`);
        return res.redirect('back');
    }
    
}