const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const messageRoutes = require('./routes/message')
const roomRoutes = require('./routes/room')
const http = require('http')
const WebSocket = require('ws');
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });
const Buffer = require('buffer').Buffer;


app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}))
const mongooseUrl = 'mongodb://localhost:27017/chat'

mongoose
  .connect(mongooseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/room', roomRoutes)

// global.onlineUsers = new Map();
const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (messages) => {
    // Broadcast the received message to all connected clients

    const data = messages.toString();
    const { event, room, message, avatar, load } = JSON.parse(data);

    console.log(event, room, message, load);
    if(event === 'join' && room && load == true){
      ws.room = room
      if (!rooms.has(room)) {
        rooms.set(room, new Set());
      }
      console.log('rooms', rooms);
      rooms.get(room).add(ws);
      // rooms.get(room).forEach(clientside => {
      //   clientside.send(JSON.stringify({ event: 'info', message: `Người dùng ${ws} đã tham gia phòng.` }));
      // });
    } else if (event === 'join' && room) {
      console.log('join room')
      ws.room = room
      if (!rooms.has(room)) {
        rooms.set(room, new Set());
      }
      console.log('rooms', rooms);
      rooms.get(room).add(ws);
      rooms.get(room).forEach(client => {
        client.send(JSON.stringify({ event: 'info', message: `Người dùng ${ws} đã tham gia phòng.` }));
      });
    } else if (event === 'message' && room) {
      console.log('rooms', rooms.has(room));
      if (rooms.has(room)) {
        rooms.get(room).forEach(client => {
          client.send(JSON.stringify({ event: 'message', message: message, avatar: avatar }));
        });
      }
    } else if (event === 'leave' && room) {
      
      if (rooms.has(room)) {
        rooms.get(room).forEach(client => {
          client.send(JSON.stringify({ event: 'info', message: `Người dùng ${ws} đã rời phòng.` }));
        });
        rooms.get(room).delete(ws);
      }
      console.log('out room', rooms.has(room))
    } else {
      wss.clients.forEach((client) => {
        console.log(client);
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      });
    }


  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});