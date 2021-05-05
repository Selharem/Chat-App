const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyPaser = require('body-parser');
const app = express();
app.use(bodyPaser.json());

//enable cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    res.header("Access-Control-Allow-Methods", 'PUT,POST,GET,DELETE');

    next();
});

// Data base connection
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log("mongoDB Connected ..."))
    .catch(err => console.log(err));


const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');


const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    socket.on('join', ({ Name, Room }, callback) => {
        const { error, user } = addUser({ id: socket.id, Name, Room });
        console.log(Name,Room);
        if (error) return callback(error);

        socket.join(user.Room);

       /* socket.emit('message', { user: 'admin', text: `${user.Name}, welcome to room ${user.Room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.Name} has joined!` });*/

        io.to(user.room).emit('roomData', { room: user.Room, users: getUsersInRoom(user.Room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.Room).emit('message', { user: user.Name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started on `));