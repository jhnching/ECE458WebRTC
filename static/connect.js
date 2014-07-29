var peer;
var name;
var room;
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
					}	
				}
			);
		});
	}else{
		alert("Please enter a valid username and room.")
	}
}

function connectToPeers(id, alias){
	var conn = peer.connect(id);
	conn.on('open', function(){
		conn.on('data', function(){
			console.log("received", data);
		});
		conn.send(alias + " has joined the room.");
	});
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
