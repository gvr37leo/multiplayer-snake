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

var players = [];

io.sockets.on("connection",function(socket){

	console.log("a client has connected: " + socket.id);

	players.push(
		{
			"id": socket.id,
			"x":100,
			"y":100,
		}
	);

	io.sockets.emit("move",players);

	//data contains direction and clientid
	socket.on("move",function(data){
		if(data.direction == "up"){
			getPlayerByID(data.socketID).y -= 10;
		} else if(data.direction == "down"){
			getPlayerByID(data.socketID).y += 10;
		} else if(data.direction == "left"){
			getPlayerByID(data.socketID).x -= 10;
		} else if(data.direction == "right"){
			getPlayerByID(data.socketID).x += 10;
		} 

		io.sockets.emit("move",players);
	});





	socket.on("new user",function(data,callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		} else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			io.sockets.emit("usernames",nicknames);
		}
	})

	socket.on("send-message",function(data){
		io.sockets.emit("new message",socket.nickname + ":" + data);
	})

	socket.on("disconnect",function(data){
		for(var i = 0; i<players.length;i++){
			if(players[i].id == socket.id){
				players.splice(i,1);
			}
		}
		io.sockets.emit("move",players);
		console.log("a client has disconnected: " + socket.id);
		if(!socket.nickname){
			return;
		}
		nicknames.splice(nicknames.indexOf(socket.nickname),1);
		io.sockets.emit("usernames",nicknames);

		
	});

});

function getPlayerByID(id){
	for(var i = 0;i < players.length;i++){
		if(id == players[i].id){
			return players[i];
		}
	}
}