const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./server/deliveries/controller/auth/index');
const uploadRouter = require('./server/deliveries/controller/upload');
const getUsersRouter = require('./server/deliveries/controller/user');
const getRoomChatData = require('./server/shared/users/getRoomChatData');
const updateRooms = require('./server/shared/users/updateRooms');
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);
app.use(cors());
app.use(cookieParser());
app.use(router);   
app.use(uploadRouter);     
app.use(getUsersRouter);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => { 
    const { error, user } = addUser({ id: socket.id, name, room });
        
    if(error) return callback(error);   
    socket.join(user.room);    
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    //socket.emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

   if(room){
    return getRoomChatData(room,io);
   }
    callback();
  });

  socket.on('sendMessage', (message,room, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message });
    callback();
    let userCategory = null;
    /**  save messages to db  **/   
    userCategory = updateRooms(room,user,message);
    userCategory.save((error,doc) => {   
      if(error) return res.json({success:false});
    }); 
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});   

app.use('/api/user',router);
app.use('/api/user',uploadRouter);
app.use('/api/user',getUsersRouter);
server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
