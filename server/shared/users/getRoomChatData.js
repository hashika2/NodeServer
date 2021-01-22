const {students,chats,officers,clients,developers} = require('../../../rooms/rooms');
const { User} = require( '../database/entities/User');


const getRoomChatData = (room,io) => {
    if(room =="Students"){   
        students.find((err,data)=>{
          return io.emit("output message",data);      
        })
      }
      if(room =="Officers"){
        officers.find((err,data) => {
          return io.emit("output message",data);
        })
      }
      if(room =="Clients"){       
        clients.find((err,data) => {
          return io.emit("output message",data);
        })
      }
      if(room =="Developers"){
        developers.find((err,data) =>{
          return io.emit("output message",data);
        })
      }
      if(room =="Private"){
        User.find((err,data) => {
          return io.emit("output data",data);
        })
      }
      else {
        chats.find((err,data) =>{
          return io.emit("output message",data);
        })
      }
}

module.exports = getRoomChatData;