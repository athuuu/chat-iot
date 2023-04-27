//const { send } = require("process");
const express = require("express");
const { join } = require("path");
const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const http = require("http").createServer(app);

const io = require("socket.io")(http);

const Sequelize = require("sequelize");

const dbPath = path.resolve(__dirname, "chat.sqlite");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: dbPath,
});

const Chat = require("./Models/Chat")(sequelize, Sequelize.DataTypes);

Chat.sync();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("deconnecter", () => {
    console.log("user deco ");
  });

  socket.on("enter_room", (room) => {
    socket.join(room);
    console.log(socket.rooms);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(socket.rooms);
  });

  socket.on("chat_message", (msg) => {
    const message = Chat.create({
      username: msg.username,
      message: msg.message,
      room: msg.room,
      createdAt: msg.createdAt,
    })
      .then(() => {
        io.in(msg.room).emit("chat_message", msg);
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

http.listen(3000, () => {
  console.log("serveur en marche");
});
