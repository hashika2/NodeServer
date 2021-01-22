const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user:{
        type:String
    },
    message:{
        type:String
    }
})

const chatUser = mongoose.model('chatUser',schema);

exports.User = chatUser;