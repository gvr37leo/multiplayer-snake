$(document).ready(function(){
    var socket = io.connect();
    var canvas = document.getElementById("mycanvas");
    canvas.addEventListener('keydown', doKeyDown, true);
    var ctxt = canvas.getContext("2d");
    
    var width = canvas.width;
	var height = canvas.height;

    var fieldWidth = 10;
    var fieldHeight = 10;

    var blockWidth = width/fieldWidth;
    var blockHeight = height/fieldHeight;

    socket.on("init",function(data){
        fieldWidth = data.fieldWidth;
        fieldHeight = data.fieldHeight;
    });

    socket.on("update",function(data){
        clearCanvas();
        for(var i = 0; i < data.snakes.length;i++) {
            drawSnake(data.snakes[i]);
        }
        drawCandy(data.candy);
        drawHUD(ctxt);
    });

    function doKeyDown(e){
        if (e.keyCode == 87) {
            socket.emit("update",{"socketID":socket.id,"direction":"up"});
        }
        if (e.keyCode == 83) {
            socket.emit("update",{"socketID":socket.id,"direction":"down"});
        }
        if (e.keyCode == 65) {
            socket.emit("update",{"socketID":socket.id,"direction":"left"});
        }
        if (e.keyCode == 68) {
            socket.emit("update",{"socketID":socket.id,"direction":"right"});
        }
    }

    function clearCanvas() {
        //noinspection SillyAssignmentJS
        canvas.width = canvas.width;
    }

    function drawHUD(ctxt){
    }

    function drawSnake(snake){
        ctxt.fillStyle = 'rgb(0,0,0)';
        ctxt.fillRect(snake.x * blockWidth,snake.y * blockHeight,Math.ceil(blockWidth),Math.ceil(blockHeight));
        ctxt.fillStyle = 'rgb(0,0,0)';
        for (var i = 0; i < snake.bodyParts.length; i++) {
            var color = Math.ceil((i / snake.bodyParts.length) * 255);
            ctxt.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
            ctxt.fillRect(snake.bodyParts[i].x * blockWidth,snake.bodyParts[i].y * blockHeight,Math.ceil(blockWidth),Math.ceil(blockHeight));
            ctxt.fillStyle = 'rgb(0,0,0)';
        }
    }

    function drawCandy(candy){
        ctxt.fillStyle = 'rgb(255,0,0)';
        ctxt.fillRect(candy.x * blockWidth,candy.y * blockHeight,Math.ceil(blockWidth),Math.ceil(blockHeight));
        ctxt.fillStyle = 'rgb(0,0,0)';
    }
});

	