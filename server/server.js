const express = require("express");
const app = express();
const port = 3001;  //포트 번호 3001
var http = require("http").createServer(app);
const io = require("socket.io")(http, {cors:{origin:"*"}});

io.on("connection", (socket) => {
    socket.on("send message", (item) => {
        const message = "message : " + item.msg;
        console.log(message);
        io.emit("receive message", { msg: item.msg });
    });
    socket.on("disconnect", function () {
        console.log("user disconnected: ", socket.id);
    });
});
http.listen(port, () => {
    console.log(`app listening on port : ${port}`);
});