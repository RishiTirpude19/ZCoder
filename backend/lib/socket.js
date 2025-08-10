const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
require("dotenv").config;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.VITE_FRONTEND_URL],
    credentials: true,
  },
});

function getReciverSocketId(reciverId) {
  return userSocketMap[reciverId];
}

const userSocketMap = {}; 

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  const userId = socket.handshake.query.userId;

  if (userId) {
    
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.broadcast.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

module.exports = { io, server, app, getReciverSocketId };
