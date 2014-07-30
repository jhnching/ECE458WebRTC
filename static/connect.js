var peer;
var name;
var room;
var conn;
var sentdata;
window.onbeforeunload = disconnectSelf;

function submitName(){
	console.log("submitName function called");
	name = document.getElementById("nameInput").value;
	myName = name;
	room = document.getElementById("roomInput").value;

	if(name!="" && room!=""){
		peer = new Peer({key: "fb6v0c1ybiseb3xr"});
		peer.on('call', function(call){
			call.answer(window.localStream);
			showTheirVid(call);
		});
		peer.on('connection', function(connect){
			conn = connect;
			setConnectCallbacks(conn);
		});
		peer.on('open', function(id){
			$.post("/r/" + room, {userAlias: name, id: id},
				function(retVal){ 
					if (retVal){
						retVal = JSON.parse(retVal);
						if (retVal['state']){
							document.getElementById("myvid").style.display = "block";
							document.getElementById("connectUser").style.display='none';
							console.log(retVal['data']);
							for(user in retVal['data']){
								connectToPeers(retVal['data'][user], user);
							}
						}
						else{
							alert(retVal['message']);
							peer.destroy();
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

function setConnectCallbacks(conn){
	console.log("in connectcb");
	conn.on('data', function(data){
		console.log(data);
		if (data['type']!= null){
			console.log("got a file " + data);
			//createFileSys();
			//sentdata = data;
			var arr = new Uint8Array(data['data']);
			var b = new Blob([arr], {type:'application/octet-stream'});
			var url = (window.webkitURL||window.URL).createObjectURL(b);
			//location.href = url;
			downloadWithName(url, data['name']);

		}
		console.log(data);
	});
	conn.on('open', function(data){
		console.log("connection is now open");
	});
	conn.on('close', function(data){
		console.log("connection is now closed");
		disconnectPeers(true);
	});
}

function connectToPeers(id, alias){
	conn = peer.connect(id);
	console.log("trying to connect to " + id + " alias is " + alias);
	setConnectCallbacks(conn);
	//conn.send({'alias':alias});
	var call = peer.call(id, window.localStream);
	showTheirVid(call);
}

function disconnectSelf(){
	disconnectPeers(false);
}

function disconnectPeers(me){
	// some ghetto shit goin' on
	console.log("disconecting alias  " + name);
	$.post("/deleteUserFromRoom" ,{userAlias: name, roomid:room, disconnectOther:me},
		function(ret){
			if(ret){
			
			}	
		}
	);
	if(!me){
		conn.close();
		peer.destroy();
	}
	theirvid = document.getElementById("theirvid");
	theirvid.style.display="none";
	document.getElementById("myvid").setAttribute("class", "mainVideo");
	document.getElementById("vidLabel").style.display="none";
}

function showTheirVid(call){
	//disconnectListener();
	console.log("showtheirvid gets called");
	call.on('stream', function(stream){
		theirvid = document.getElementById("theirvid");
		theirvid.style.display="block";
    	theirvid.src = URL.createObjectURL(stream);
    	console.log("before change to overlay");
    	document.getElementById("myvid").setAttribute("class", "overlay");
    	document.getElementById("vidLabel").style.display="block";
    });

}

function sendFile(f){
	// stuck on this...
	console.log("sending file");
	if (conn == null){
		return;
	}
	console.log(f.name);
	var reader = new FileReader();
	reader.onload = function(event) {
		console.log(reader.result);
		conn.send({
    	type:f.type,
    	name:f.name,
    	data:new Blob([reader.result], {type:'application/octet-stream'})
		});
	    console.log("File content finished send");
	};
	reader.onerror = function(event) {
	    console.error("File could not be read! Code " + event.target.error.code);
	};
	reader.readAsArrayBuffer(f);
}

function downloadWithName(uri, name) {
    function eventFire(el, etype){
        if (el.fireEvent) {
            (el.fireEvent('on' + etype));
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    eventFire(link, "click");

}