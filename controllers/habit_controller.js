
const Habit = require('../models/habits');
const User = require('../models/user');

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


// creating a new habit
module.exports.createHabit = async function(req, res){

    
    try{

        let user = await User.findById(req.user.id).populate('habits');

        if(user){

            let today = new Date();
            let date = today.getDate();
            let newHabit = req.body.habit;
            let userHabits = user.habits;
            for(let i = 0; i<userHabits.length;i++){
                if(userHabits[i].content.toLowerCase() == newHabit.toLowerCase()){
                    console.log('habit already found for user');
                    req.flash('error','This Habit already exists,please track a new one !');
                    return res.redirect('back');
                }
            }
          
            
            let habit = await Habit.create({
                content : newHabit,
                date_creation : date,
                days : ['None', 'None', 'None', 'None', 'None', 'None', 'None'],
                user : user.id,
                completed : 0,
                streak : 0,
            });
            
            req.flash('success', `Hurrayy ! You've just added ${habit.content} as your new habit ! `);
            user.habits.push(habit.id);
            user.save();
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        return;
    }
    

    

}


// deleting a  habit
module.exports.deleteHabit = async function(req, res){
    
    try{
        let id = req.params.id;

        // check if it exists
        let habit = await Habit.findById(id);
        
        if(habit){
            let user_id = habit.user;
            habit.remove();

            // deleting habit id from the user habits array
            await User.findByIdAndUpdate(user_id, { $pull : { habits : id } });
            req.flash('success', `You've successfully removed ${habit.content} from your habits :)`);
            return res.redirect('/habits/dashboard');
        }
    }catch(err){
        req.flash('error', 'Habit not deleted');
        return res.redirect('/habits/dashboard');
    }
    
}

module.exports.dashboard = async function(req, res){
    try{
        if(req.isAuthenticated()){

            let user = await User.findById(req.user.id).populate('habits');
    
            let habits = user.habits;
           
            
            return res.render('dashboard', {
                title : "trackifyme | Dashboard",
                habits : habits,
                user : user,
            });
        }
    }catch(err){
        console.log(err);
        return res.render('user_sign_in', {
            title : "trackifyme | Sign In"
        });
    }

}

// updating status
module.exports.update = async function(req, res){
    try{
    let id = req.params.id;
    let day = req.params.day;
    
    let status = req.params.status;

    Habit.findById(id, function(err, habit){
        if(err){
            console.log('Error in finding habit in updation', err);
            return res.redirect('back');
        }
        habit.days[day] = status;
        habit.save();
        updateStreakAndCompleted(habit);
        if(status == 'Done'){
            req.flash('success', `Great work ! We've marked ${habit.content} as done for the day !`);
        }else if(status == 'Not Done'){
            req.flash('success', `That's sad :/ Try to complete ${habit.content} by the end of the day `);
        }else{
            req.flash('success', `Tie up your laces and finish ${habit.content} by the end of the day `);
        }
        
        return res.redirect('/habits/dashboard-weekly');
    });
}catch(err){
    console.log(err);
    return;
}
}



// weekly habit view
module.exports.weeklyView = async function(req, res){

    try{
        if(req.isAuthenticated()){
           
                let date = new Date();
                let days = [];
        
                for(let i = 0; i < 7; i++){
                    let d = date.getDate() + ' ' + Months[date.getMonth()] + ',' + date.getFullYear();
                    date.setDate(date.getDate() - 1);   
                    days.push(d);
                    console.log(d);
                }

                // finding a user and all habits regarding that user
                let user = await User.findById(req.user.id).populate('habits');
                let habits = user.habits;
        
                // update user habits 
                updateData(habits);
                return res.render('weekly', {
                    title : "trackifyme | weeklyBoard",
                    habits : habits,
                    days,
                });
               
            }
        
           
           
         
           
        }catch(err){
        console.log(err);
        return;
    }

}



let updateData = function(habits){
    let todayDate = new Date().getDate();

  
    for(let habit of habits){
        let id = habit.id;
        let diff = todayDate - habit.date_creation;

        if(diff > 0 && diff < 8){
            for(let i = diff, j = 0; i < habit.days.length; i ++, j ++){
                habit.days[j] = habit.days[i];
            }

            let remPos = habit.days.length - diff;
            for(let i = remPos; i < habit.days.length; i++){
                habit.days[i] = 'None';
            }

            habit.date_creation = todayDate;
            updateStreakAndCompleted(habit);
            habit.save();
        }else if(diff > 7){
            for(let i = 0; i < 7; i++){
                habit.days[i] = 'None';
                habit.date_creation = todayDate;
                updateStreakAndCompleted(habit);
                habit.save();
            }
        }
    }
}


let updateStreakAndCompleted = async function(habit){
    try{
        let curr_completed = 0;
        let max_streak = 0;
        curr_streak = 0;
        for (let i = 0; i < habit.days.length; i++) {
            if(habit.days[i] == 'Done'){
                curr_completed ++;
                curr_streak ++;
            }else{
                if(curr_streak > max_streak){
                    max_streak = curr_streak;
                    curr_streak = 0;
                }else{
                    streak = 0;
                }
            }
        }

        if(curr_streak > max_streak){
            max_streak = curr_streak;
        }
        await Habit.findByIdAndUpdate(habit.id, {
            streak : max_streak,
            completed : curr_completed,
        });
    }catch(err){
        console.log(err);
        return;
    }
}

