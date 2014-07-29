var peer;
var name;
var room;
var conn;
function submitName(){
	console.log("submitName function called");
	name = document.getElementById("nameInput").value;
	myName = name;
	room = document.getElementById("roomInput").value;

	if(name!="" && room!=""){
		peer = new Peer({key: "fb6v0c1ybiseb3xr"});
		
		peer.on('open', function(id){
			$.post("/r/" + room, {userAlias: name, id: id},
				function(retVal){ 
					if (retVal){
						retVal = JSON.parse(retVal);
						console.log(retVal['data']);
						//window.location.href = "room/" + room;
						for(user in retVal['data']){
							console.log(retVal['data'][user]);
							console.log(user);
							connectToPeers(retVal['data'][user], user);
						}

						window.close(disconnectPeers());
					}	
				}
			);
		});
	}else{
		alert("Please enter a valid username and room.")
	}
}

function connectToPeers(id, alias){
	conn = peer.connect(id);
	console.log("done connecting");
	conn.on('open', function(){
		console.log("connection is open");
		conn.on('data', function(data){
			console.log("received", data);
		});

		conn.on('disconnected', function(data){
			console.log("disconnected, data")
		});
		conn.send(alias + " has joined the room.");
	});
}

function disconnectPeers(){

}

function getPeers(){
	$.post("/g", {userAlias: alias, room: room},
		function(data){ 
			for (key in data){
				var conn = peer.connect(data[key]);		
			}
		}
	);
}
