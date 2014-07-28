var myName = "";
function submitName(){
	console.log("submitName function called");
	var name = document.getElementById("nameInput").value;
	myName = name;
	var room = document.getElementById("roomInput").value;

	if(name!="" && room!=""){
		var peer = new Peer({key: "fb6v0c1ybiseb3xr"});
		
		peer.on('open', function(id){
			$.post("/r/" + room, {userAlias: name, secret: id},
				function(data){ 
					if (data){
						window.location.href = "room/" + room;
					}	
				}
			);
		});

	}else{
		alert("Please enter a valid username and room.")
	}
}

function connectToPeers(){
	console.log("connectToPeers function called");

}

function getPeers(){

}
