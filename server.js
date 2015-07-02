var express = require("express"),
app = express(),
server = require("http").createServer(app),
io = require("socket.io").listen(server);
server.listen(8000);
app.use(express.static(__dirname + '/'));
app.get('/',function(req,res){
	res.sendfile(__dirname + "/index.html");
});

var fieldWidth = 10;
var fieldHeight = 10;

var snakes = [];
var candy ={
    x:Math.floor(Math.random() * fieldWidth),
    y:Math.floor(Math.random() * fieldHeight)
};

io.sockets.on("connection",function(socket){

    io.sockets.emit("init",{fieldWidth:fieldWidth,fieldHeight:fieldHeight});

    snakes.push({
        id: socket.id,
		x: 5,
		y: 5,
		vx:1,
		vy:0,
		length: 0,
        highscore: 0,
		bodyParts:[],
        directionChanged: false
	});
	console.log("a client has connected: " + socket.id);
    
    socket.on("update",function(data){
        var snake = getSnakeByID(socket.id);
		if(data.direction == "up"){
			snake.vx = 0;
            snake.vy = -1;
		} else if(data.direction == "down"){
			snake.vx = 0;
            snake.vy = 1;
		} else if(data.direction == "left"){
			snake.vx = -1;
            snake.vy = 0;
		} else if(data.direction == "right"){
            snake.vx = 1;
            snake.vy = 0;
		}
        snake.directionChanged = true;
	});
    socket.on("disconnect",function(){
        console.log("a client has disconnected: " + socket.id);
        for(var i = 0; i<snakes.length;i++){
            if(snakes[i].id == socket.id){
                snakes.splice(i,1);
            }
        }
    });
});

setInterval(function(){
    updateSnakes();
    io.sockets.emit("update",{snakes:snakes,candy:candy});
},200);

function updateSnakes(){
   snakes.forEach(function(snake){
       snake.bodyParts.push(
            {
                direction:0,
                age:0,
                x:snake.x,
                y:snake.y
            }
        );

       for(var i = snake.bodyParts.length - 1;i >= 0 ;i--){
            snake.bodyParts[i].age ++;
            if(snake.bodyParts[i].age > snake.length){
                snake.bodyParts.splice(i,1);
            }
        }
       
		snake.x += snake.vx;
		snake.y += snake.vy;
		if(snake.x >= fieldWidth){
			snake.x = 0;
		} 
		else if(snake.x < 0){
			snake.x =fieldWidth - 1;
		}
		if(snake.y >=fieldHeight){
			snake.y = 0;
		}
		else if(snake.y < 0){
			snake.y = fieldHeight - 1;
		}
       if(snake.x == candy.x && snake.y == candy.y){
            snake.length ++;

            if(snake.length > snake.highscore){
                snake.highscore = snake.length;
            }
            candy.x = Math.floor(Math.random() * fieldWidth);
            candy.y = Math.floor(Math.random() * fieldHeight);
       }
       for(var i = 0; i < snake.bodyParts.length; i++){
            if(snake.x == snake.bodyParts[i].x && snake.y == snake.bodyParts[i].y){
               snake.bodyParts = [];
                snake.x = 5;
                snake.y = 5;
                snake.vx = 1;
                snake.vy = 0;
                snake.length = 0;
            }    
        }
        snake.directionChanged = false;
   });
}

function getSnakeByID(id){
    for(var i = 0;i < snakes.length;i++){
		if(id == snakes[i].id){
			return snakes[i];
		}
	}
}
