
var socket = io.connect();
var canvas = document.getElementById("mycanvas");
canvas.addEventListener('keydown', doKeyDown, true);

canvas_context = canvas.getContext("2d");

function doKeyDown(e){
    if (e.keyCode == 87) {
        socket.emit();
    }
    if (e.keyCode == 83) {
        socket.emit();
    }
    if (e.keyCode == 65) {
        socket.emit();
    }
    if (e.keyCode == 68) {
        socket.emit();
    }
}



function clearCanvas() {
    canvas.width = canvas.width;
}
	