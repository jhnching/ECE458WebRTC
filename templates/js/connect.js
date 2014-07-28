function submitName(){
	console.log("submitName function called");
	var name = document.getElementById("nameInput").value;
	var room = document.getElementById("roomInput").value;

	if(name!="" && room!=""){
		var peer = new Peer({key: "fb6v0c1ybiseb3xr"});
		
		peer.on('open', function(id){
			$.ajax({
				url: "/r/" + room,
				success: {
					console.log("it worked");
				}
			});
		});
	}else{
		alert("Please enter a valid username and room.")
	}
}
