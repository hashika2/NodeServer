const {students,chats,officers,clients,developers} = require('../../../rooms/rooms');

let userCategory = null;
const updateRooms = (room,user,message) => {
    if(room == 'Officers'){
        userCategory = new officers({
         name:user.name,
         message:message
       })
     }
     if(room == "Students") {
       userCategory = new students({
         name:user.name,
         message:message
       })
     }
     if(room == "Clients") {
       userCategory = new clients({
         name:user.name,
         message:message
       })
     }
     if(room == "Developers") {
       userCategory = new developers({
         name:user.name,
         message:message
       })   
     }
     else {
       userCategory = new chats({
         name:user.name,
         message:message
       })
     }
     return userCategory;
}

module.exports = updateRooms;