//const { send } = require("process");
const express = require("express")
const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.get("/", (req, res) =>  {
    res.sendFile(__dirname + "/index.html"); 
});

io.on("connection", (socket) => {
    console.log(socket.id); 

    socket.on("deconnecter", () => {
        console.log("user deco ")
    });

    socket.on("chat_message", (msg) => {
        io.emit("chat_message", msg);
    });
});




http.listen(3000, () => {
    console.log("serveur en marche")
});

