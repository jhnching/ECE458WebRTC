function submitName(){
	console.log("submitName function called");
	var name = document.getElementById("nameInput").value;
	var room = document.getElementById("roomInput").value;

	if(name!="" && room!=""){
		var peer = new Peer({key: "fb6v0c1ybiseb3xr"});
		
		peer.on('open', function(id){
			$.post("/r/" + room, {userAlias: name, secret: id},
				function(data){
					console.log(data);
					for (user in data){
						var conn = peer.connect(data[user]['secret']);

					}
					window.location.href = "room.html";
				}
			);
		});
	}else{
		alert("Please enter a valid username and room.")
	}
}
