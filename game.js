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

    var previousScore;
    var sound = new Howl({
        urls: ['snake.mp3'],
        buffer: true,
        loop: true
    });

    socket.on("init",function(data){
        fieldWidth = data.fieldWidth;
        fieldHeight = data.fieldHeight;
    });

    socket.on("update",function(data){
        if(getOwnSnake(data.snakes).length == 9 && previousScore == 8){
            sound.fadeIn(1,2000);
        }
        if(getOwnSnake(data.snakes).length == 0 && previousScore > 0){
            sound.fadeOut(0,1000);
        }
        previousScore = getOwnSnake(data.snakes).length;
        clearCanvas();
        for(var i = 0; i < data.snakes.length;i++) {
            drawSnake(data.snakes[i]);
        }
        drawCandy(data.candy);
        drawHUD(data.snakes);
    });

    function doKeyDown(e){
        if (e.keyCode == 87 || e.keyCode == 38) {
            socket.emit("update",{"socketID":socket.id,"direction":"up"});
        }
        if (e.keyCode == 83 || e.keyCode == 40) {
            socket.emit("update",{"socketID":socket.id,"direction":"down"});
        }
        if (e.keyCode == 65 || e.keyCode == 37) {
            socket.emit("update",{"socketID":socket.id,"direction":"left"});
        }
        if (e.keyCode == 68 || e.keyCode == 39) {
            socket.emit("update",{"socketID":socket.id,"direction":"right"});
        }
    }

    function clearCanvas() {
        //noinspection SillyAssignmentJS
        canvas.width = canvas.width;
    }

    function drawHUD(snakes){
        for(var i = 0;i<snakes.length;i++){
            if(snakes[i].id == socket.id){
                ctxt.font="20px Arial";
                ctxt.fillText("score: " + snakes[i].length,10,20);
                ctxt.fillText("highscore: " + snakes[i].highscore,10,40);
            }
        }
    }

    function drawSnake(snake){
        ctxt.fillStyle = 'rgb(0,0,0)';
        ctxt.fillRect(snake.x * blockWidth,snake.y * blockHeight,Math.ceil(blockWidth),Math.ceil(blockHeight));
        ctxt.fillStyle = 'rgb(0,0,0)';
        for (var i = 0; i < snake.bodyParts.length; i++) {
            var color = Math.ceil((i / snake.bodyParts.length) * 255);
            ctxt.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
            ctxt.fillRect(Math.floor(snake.bodyParts[i].x * blockWidth),Math.floor(snake.bodyParts[i].y * blockHeight),Math.ceil(blockWidth),Math.ceil(blockHeight));
            ctxt.fillStyle = 'rgb(0,0,0)';
        }
    }

    function drawCandy(candy){
        ctxt.fillStyle = 'rgb(255,0,0)';
        ctxt.fillRect(candy.x * blockWidth,candy.y * blockHeight,Math.ceil(blockWidth),Math.ceil(blockHeight));
        ctxt.fillStyle = 'rgb(0,0,0)';
    }

    function getOwnSnake(snakes){
        for(var i = 0;i < snakes.length;i++){
            if(snakes[i].id == socket.id){
                return snakes[i];
            }
        }
    }
});

	