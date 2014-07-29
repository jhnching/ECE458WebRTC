var peer;
var name;
var room;
var conn;
var sentdata;
var once = true;
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
						document.getElementById("myvid").style.display = "block";
						document.getElementById("connectUser").style.display='none';
						retVal = JSON.parse(retVal);
						console.log(retVal['data']);
						peer.on('call', function(call){
							call.answer(window.localStream);
							console.log("getting a call");
							showTheirVid(call);

						});
						peer.on('connection', function(connect){
							console.log("setting conn");
							conn = connect;
							conn.on('data', function(data){
								console.log(data);
								if (data == "close"){
									disconnectPeers();
								}
								if (data['type']!= null){
									console.log("got a file " + data);
									//createFileSys();
									//sentdata = data;
									var arr = new Uint8Array(data['data']);
									var b = new Blob([arr], {type:'application/octet-stream'});
									var url = (window,webkitURL||window.URL).createObjectURL(b);
									//location.href = url;
									downloadWithName(url, data['name']);

								}
								console.log(data);
								if (data == "close"){
									disconnectPeers();
								}
								//var call = peer.call(data, window.localStream);
								//showTheirVid(call);
							});
							conn.on('open', function(data){
								console.log("connection is now open");
								//var call = peer.call(data, window.localStream);
								//showTheirVid(call);
							});
							conn.on('close', function(data){
								console.log("connection is now closed");
								//var call = peer.call(data, window.localStream);
								//showTheirVid(call);
							});
						});
						peer.on('disconnect', function(){
							disconnectPeers();
							console.log("DISCONNECTED");
						});
						peer.on('close', function(){
							disconnectPeers();
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
	conn.on('data', function(data){
		if (data['type']=='file'){
			console.log("got a file " + data);
			createFileSys();
			sentdata = data;
		}
		console.log(data);
		if (data == "close"){
			disconnectPeers();
		}
		//var call = peer.call(data, window.localStream);
		//showTheirVid(call);
	});
}

function disconnectPeers(once){
	console.log("disconecting peers");

	if(once)conn.send("close");
	once = false;
	peer.disconnect();
	theirvid = document.getElementById("theirvid");
	theirvid.style.display="none";
}


function showTheirVid(call){
	//disconnectListener();
	console.log("showtheirvid gets called");
	call.on('stream', function(stream){
		theirvid = document.getElementById("theirvid");
		theirvid.style.display="block";
    	theirvid.src = URL.createObjectURL(stream);
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
/*
// file stuff
function onInitFs(fs) {
	console.log("in onInitFS, fs is " + fs);
	fs.root.getFile(sentdata['name'], {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

		fileWriter.onwriteend = function(e) {
		location.href = fileEntry.toURL();
		};

		fileWriter.onerror = function(e) {
		console.log('Write failed: ' + e.toString());
		};
		var arr = new Uint8Array(sentdata['data']);
		console.log(arr);

			
		fileWriter.write(new Blob([arr], {type:sentdata['type']}));

      	//new Blob(sentdata['data'], {type:sentdata['type']}));

    }, errorHandler);

  }, errorHandler);

}

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function createFileSys(){
	console.log("creating filesys");
	navigator.webkitPersistentStorage.requestQuota(1024*1024, function(grantedBytes) {
	  	window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler); 
		}, function(e) {
	  	console.log('Error', e); 
		});
	console.log("done creating file system");
}
*/