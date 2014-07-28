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
						console.log(room);
						document.cookie = "alias=" + name;
						document.cookie = "room=" + room;
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
	var alias = getCookie("alias");
	var room = getCookie("room");
	console.log("my name is " + alias + " and my room is " + room);
	/*$.post("/g/", {userAlias: alias, room: room},
		function(data){ 
			if (data){
				document.cookie = "alias=" + name;
				window.location.href = "room/" + room;
			}	
		}
	);*/
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
} 
