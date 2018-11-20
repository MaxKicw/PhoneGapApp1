var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//For JSON Call
		
		//
       	app.receivedEvent('deviceready');
    	var options = {frequency: 1000};
   		//Accelerometer call
		navigator.accelerometer.watchAcceleration(accelerometerSuccess, onError, options);
		window.plugins.PushbotsPlugin.initialize("5b151b591db2dc70b473dcb0", {"android":{"sender_id":"687741121085"}});
		// Mit API für Activity Recognition Verbinden
		window.plugin.ActivityRecognition.Connect();
		// Only with First time registration - For Pushbot
		window.plugins.PushbotsPlugin.on("registered", 		function(token){
		console.log("Registration Id:" + token);
		});

		//Get user registrationId/token and userId on PushBots, with evey launch of the app even launching with notification
		
		window.plugins.PushbotsPlugin.on("user:ids", 	function(data){
		console.log("user:ids" + JSON.stringify(data));
		});
		
		//Diese Funktion wird ausgeführt, wenn die App eine Nachricht erhalten hat
		
		window.plugins.PushbotsPlugin.on("notification:received", function(data){
		
			function sendFetch(){
				fetchAll();
				fetch(serverURL, {
					method: 'POST',
					body: JSON.stringify({answer:answer,network:net,acceleration:acc,gps:gps,lightsensor:light,proimitysensor:prox}), // data can be `string` or {object}!
					headers:{
					  'Content-Type': 'application/json'
					}
				  }).then(res => res.json())
				  .then(response => console.log('Success:', JSON.stringify(response)))
				  .catch(error => console.error('Error:', error));
			}
			sendFetch();

  			document.getElementById('popup').classList.add('active');
		});
		// Geolocation/Gyroscope/Abstandssensor/Lichtsensor
		navigator.geolocation.getCurrentPosition(positionSuccess);
		navigator.gyroscope.watchGyroscope(gyroscopeSuccess, gyroscopeError, options);
		navigator.proximity.enableSensor();
		setInterval(function(){
			navigator.proximity.getProximityState(proximitySuccess);
			window.plugin.lightsensor.getReading(lightSuccess);
		}, 1000);
		//Netzwerkverbindung
		fetchNetworkConnectionInfo();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
//Globale Variablen
var prox;//für Abstandssensor
var acc;//Beschleunigungssensor 
var gps;//GPS-Sensor
var light;//Lichtsensor
var gyro;//Gyroscope
var net;//Netzwerkverbindung
var didClickIt = false;//For ServerURL
var serverURL = 'https://calm-wildwood-42488.herokuapp.com/response';//ServerURL
//------------Daten des Beschleunigungssensors--------------------//
function accelerometerSuccess(acceleration) {
		acc = acceleration;
        var node = document.createElement('div');
        document.getElementById('1').innerHTML = '';
        node.innerHTML = '<p>Beschleunigungssensor:<br>X-Achse :</p>'+acceleration.x+'<p>Y-Achse :</p>'+acceleration.y+'<p>Z-Achse :</p>'+acceleration.z+'<p>Time :</p>'+acceleration.timestamp;
        document.getElementById('1').appendChild(node);
};
function onError(error){
        console.log("---Error--"+error.code+"---MSG---"+error.message);
};
//----------------Geräteinformationen------------------------//

//------------Art der Netzwerkverbindung--------------------//

function fetchNetworkConnectionInfo(){
	console.log("-----Netzwerk-----");
	navigator.vibrate(300);
    var networkType = navigator.network.connection.type;
	net = networkType;
    var networkTypes = {};
    networkTypes[Connection.NONE] = "Keine Netzwerkverbindung";
    networkTypes[Connection.UNKNOWN] = "Unbekannte Netzwerkverbindung";
    networkTypes[Connection.CELL_2G] = "2G Netzwerkverbindung";
    networkTypes[Connection.CELL_3G] = "3G Netzwerkverbindung";
    networkTypes[Connection.CELL_4G] = "4G Netzwerkverbindung";
    networkTypes[Connection.WIFI] = "WiFi Netzwerkverbindung";
    networkTypes[Connection.ETHERNET] = "Ethernet Netzwerkverbindung";
    
    document.getElementById('2').innerHTML = networkTypes[networkType];
};

//---------GPS-Location----------------------------------//

function positionSuccess(position){
    console.log("-----Location-----");
	gps = position.coords;
    var node = document.createElement('div');
    node.innerHTML = '<p>GPS:<br>Latitude : </p>'+ position.coords.latitude+'<p>Longitude :</p>'+position.coords.longitude+'<p>Höhe :</p>'+position.coords.altitude;
    document.getElementById('3').appendChild(node);
};

//---------Gyroscope----------------------------------//

function gyroscopeSuccess(acceleration) {
	    console.log("-----GYRO-----");
		gyro = acceleration;
		document.getElementById('4').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>Gyroskop:<br>X-Achse: </p>"+acceleration.x+"<p><Y-Achse: </p>"+acceleration.y+"<p><Z-Achse: </p>"+acceleration.z;
		document.getElementById('4').appendChild(node);
};
function gyroscopeError(msg) {
	    console.log("-----GYRO-RRor----");
		alert("-----GYRO-RRor----");
        var node = document.createElement('div');
        document.getElementById('4').innerHTML = '';
        node.innerHTML = "Error"+msg.info+"MSG"+msg.message;
        document.getElementById('4').appendChild(node);
};
//-------------Proximity------------------------//
function proximitySuccess(state){
        document.getElementById('5').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>Abstandssensor/Ohrmuschel:<br>Success: "+state;
		document.getElementById('5').appendChild(node);
};
//---------------Light-------------------------//
function lightSuccess(reading){
		light = reading;
        document.getElementById('6').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>Helligkeitssenor:<br>Success: "+JSON.stringify(reading);
		document.getElementById('6').appendChild(node);
	      // Output: {"intensity": 25}
};
//---------------Activitiy-----------------------//
function ActivityStarted(){
	alert("Start des ActivityTrackings");
}
function ActivitySuccess(activity){
	alert(JSON.stringify(activity));
}
//----------------Antwortfunktion----------------//
function answer(choice){
	console.log("Answer");
	console.log(choice);
	if(choice == "ja"){
		document.getElementById('popup').classList.remove('active');
		sendToServer('Ja');
		
	}else{
		document.getElementById('popup').classList.remove('active');
		sendToServer('Nein');	
	}
};
//---------------JSON-Call------------------------//
//Quellen: https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
//
function sendToServer(answer){
		fetch(serverURL, {
			method: 'POST',
			body: JSON.stringify({answer:answer,network:net,acceleration:acc,gps:gps,lightsensor:light,proimitysensor:prox}), // data can be `string` or {object}!
			headers:{
			  'Content-Type': 'application/json'
			}
		  }).then(res => res.json())
		  .then(response => console.log('Success:', JSON.stringify(response)))
		  .catch(error => console.error('Error:', error));
};
//---------------URL-Setup----------------------//
//Quelle: https://stackoverflow.com/questions/15305527/javascript-user-input-through-html-input-tag-to-set-a-javascript-variable
document.getElementById("send").addEventListener("click",function(){
	// same as onclick, keeps the JS and HTML separate
	didClickIt = true;
});
setInterval(function(){
		// this is the closest you get to an infinite loop in JavaScript
		if( didClickIt ) {
			didClickIt = false;
			// document.write causes silly problems, do this instead (or better yet, use a library like jQuery to do this stuff for you)
			serverURL=document.getElementById("url").value+'/response';
			console.log(serverURL);
		}
	},500);

fetchAll = () => {
	console.log("Fetch all");
}
