
var socket = io.connect();
var canvas = document.getElementById("mycanvas");
canvas.addEventListener('keydown', doKeyDown, true);

canvas_context = canvas.getContext("2d");

function doKeyDown(e){
    if (e.keyCode == 87) {
        socket.emit("move",{"socketID":socket.id,"direction":"up"});
    }
    if (e.keyCode == 83) {
        socket.emit("move",{"socketID":socket.id,"direction":"down"});
    }
    if (e.keyCode == 65) {
        socket.emit("move",{"socketID":socket.id,"direction":"left"});
    }
    if (e.keyCode == 68) {
        socket.emit("move",{"socketID":socket.id,"direction":"right"});
    }
}

socket.on("move",function(data){
    clearCanvas();
    for(var i = 0; i < data.length; i++){
        canvas_context.fillRect(data[i].x, data[i].y, 50, 50);
    }
});

function clearCanvas() {
    canvas.width = canvas.width;
}
	