const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let students = mongoose.model('students',{
    _id:Schema.Types.ObjectId,
    name:[{type:Schema.Types.ObjectId, ref:"users"}],
    message:String
  });
  let chats = mongoose.model('chats',{    
    name:String,
    message:String
  });
  let officers = mongoose.model('officers',{    
    name:String,
    message:String      
  });
  let clients = mongoose.model('clients',{
    name:String,
    message:String
  });
  let developers = mongoose.model('developers',{
    name:String,
    message:String
  })

  module.exports = { students,chats,officers,clients,developers }