var peer;
var name;
var room;
var conn;

window.onbeforeunload = disconnectPeers;

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
						document.getElementById("myvid").style.visibility = "visible";
						document.getElementById("container").remove();
						retVal = JSON.parse(retVal);
						console.log(retVal['data']);
						peer.on('call', function(call){
							call.answer(window.localStream);
							console.log("getting a call");
							showTheirVid(call);

						});
						peer.on('connection', function(connect){
							conn = connect;
							conn.on('data', function(data){
								console.log(data);
								if (data == "close"){
									disconnectPeers();
								}
								//var call = peer.call(data, window.localStream);
								//showTheirVid(call);
							});
						});
						peer.on('disconnect', function(){
							console.log("DISCONNECTED");
						});
						peer.on('close', function(){
							console.log("DISCONNECTED2");
						});
						for(user in retVal['data']){
							connectToPeers(retVal['data'][user], user);
						}
						//window.close(disconnectPeers());
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
	console.log("trying to connect to " + id + " alias is " + alias);
	conn.on('open', function(){
		console.log("connection is open");
		conn.send(alias);
		var call = peer.call(id, window.localStream);
		console.log("called it");
		showTheirVid(call);
	});
}

function disconnectPeers(){
	console.log("disconecting peers");
	window.existingCall.close();
	peer.disconnect();
	conn.send("close");
}

function sendMedia(){
	var call = peer.call($('#callto-id').val(), window.localStream);
}

function disconnectListener(){
	conn.onineconnectionstatechange = function() { if(conn.iceConnectionState == 'disconnected') { console.log('Disconnected'); disconnectPeers(); } }
}

function showTheirVid(call){
	disconnectListener();
	console.log("showtheirvid gets called");
	call.on('stream', function(stream){
		theirvid = document.getElementById("theirvid");
		theirvid.style.visibility="visible";
    	theirvid.src = URL.createObjectURL(stream);
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


function sendFile(f){
	if (conn == null){
		return;
	}
	console.log(f.name);
	var reader = new FileReader();
	reader.onload = function(event) {
	    var contents = event.target.result;

	    conn.send({
	    	name:f.name,
	    	data:new Blob([contents], {type:f.type})
		});
	    console.log("File contents: " + contents);
	};
	reader.onerror = function(event) {
	    console.error("File could not be read! Code " + event.target.error.code);
	};
	reader.readAsArrayBuffer(f);
}