const mongoose  = require("mongoose");

const habitSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    content : {
        type : String,
        required : true,
    },
    completed : {
        type : Number,
    },
    streak : {
        type : Number,
    },
    date_creation : {
        type : Number,
    },
    days : [],

});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;