var express = require("express"),
app = express(),
server = require("http").createServer(app),
io = require("socket.io").listen(server),
nicknames = [];
server.listen(8000);
app.use(express.static(__dirname + '/'));
app.get('/',function(req,res){
	res.sendfile(__dirname + "/index.html");
});

io.sockets.on("connection",function(socket){

	console.log("a client has connected: " + socket.id);


    // temporary emit example
	socket.on("send-message",function(data){
		io.sockets.emit("new message",socket.nickname + ":" + data);
	})

});
