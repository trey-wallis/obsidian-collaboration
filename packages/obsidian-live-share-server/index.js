const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "app://obsidian.md",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  const { auth } = socket.handshake;
  console.log("%s connected", auth.uuid);

  //Add to active users
  activeUsers.push(auth.uuid);

  //Send active users to the user that logged in
  socket.emit("active_users", { users: activeUsers });

  //Broadcast to everyone else that the user connected
  socket.broadcast.emit("user_connected", {
    uuid: auth.uuid,
    users: activeUsers,
  });

  //Handle file data packet
  socket.on("file_data", (data) => {
    console.log("Received file data: %s", data);
    //socket.emit("file_data", data);
    socket.broadcast.emit("file_data", data);
  });

  socket.on("cursor_move", (data) => {
    console.log("Received cursor move: %s", data);
    //socket.emit("cursor_move", data);
    socket.broadcast.emit("cursor_move", data);
  });

  //Broadcast disconnect to everyone
  socket.on("disconnect", () => {
    const { auth } = socket.handshake;
    console.log("%s disconnected", auth.uuid);

    activeUsers = activeUsers.filter((uuid) => uuid !== auth.uuid);

    socket.broadcast.emit("user_disconnected", {
      uuid: auth.uuid,
      users: activeUsers,
    });
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});
