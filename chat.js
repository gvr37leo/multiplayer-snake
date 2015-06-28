$(document).ready(function(){
	var socket = io.connect();
	var $nickForm = $("#setNick");
	var $nickError = $("#nickError");
	var $nickBox = $("#nickname");
	var $users = $("#users");

	var $messageForm = $("#send-message");
	var $messageBox = $("#message");
	var $chat = $("#chat");
	var elem = document.getElementById('chat');

	$nickForm.submit(function(e){
		e.preventDefault();
		socket.emit("new user",$nickBox.val(),function(data){
			if(data){
				$("#nickWrap").hide();
				$("#contentWrap").show();
			}else{
				$nickError.html("That username is already taken");
			}
		});
		$nickBox.val("");
	});

	$messageForm.submit(function(e){
		e.preventDefault();
		socket.emit("send-message",$messageBox.val());
		$messageBox.val("");
	});

	socket.on("new message",function(data){
		$chat.append(data + "<br/>");
  		elem.scrollTop = elem.scrollHeight;
	});

	socket.on("usernames",function(data){
		var html = "";
		for(var i=0;i<data.length;i++){
			html += data[i] + "<br/>"
		}
		$users.html(html);
	});
});