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
			function sendShit(){
				var data = {hi:"Hi"};
				$.ajax({
					url: 'https://calm-wildwood-42488.herokuapp.com/response',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(data),
					dataType:'json'
				});
			};
			sendShit();

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
var serverURL;//ServerURL
//------------Daten des Beschleunigungssensors--------------------//
function accelerometerSuccess(acceleration) {
		acc = acceleration;
        var node = document.createElement('div');
        document.getElementById('1').innerHTML = '';
        node.innerHTML = '<p>X-Achse :</p>'+acceleration.x+'<p>Y-Achse :</p>'+acceleration.y+'<p>Z-Achse :</p>'+acceleration.z+'<p>Time :</p>'+acceleration.timestamp;
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
	navigator.vibrate(300);
    console.log("-----Location-----");
	gps = position;
    var node = document.createElement('div');
    node.innerHTML = '<p>Latitude : </p>'+ position.coords.latitude+'<p>Longitude :</p>'+position.coords.longitude+'<p>Höhe :</p>'+position.coords.altitude;
    document.getElementById('3').appendChild(node);
};

//---------Gyroscope----------------------------------//

function gyroscopeSuccess(acceleration) {
	    console.log("-----GYRO-----");
		gyro = acceleration;
		document.getElementById('4').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>X-Achse: </p>"+acceleration.x+"<p><Y-Achse: </p>"+acceleration.y+"<p><Z-Achse: </p>"+acceleration.z;
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
      	node.innerHTML = "<p>Success: "+state;
		document.getElementById('5').appendChild(node);
};
//---------------Light-------------------------//
function lightSuccess(reading){
		light = reading;
        document.getElementById('6').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>Success: "+JSON.stringify(reading);
		document.getElementById('6').appendChild(node);
	      // Output: {"intensity": 25}
};
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
	var data = {answer:answer,network:net,acceleration:acc,gps:gps,lightsensor:light,proimitysensor:prox};
	$.ajax({
		url: 'https://calm-wildwood-42488.herokuapp.com/response',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		dataType:'json'
	});
};
//---------------URL-Setup----------------------//
//Quelle: https://stackoverflow.com/questions/15305527/javascript-user-input-through-html-input-tag-to-set-a-javascript-variable
document.getElementById("send").addEventListener("click",function(){
        // same as onclick, keeps the JS and HTML separate
        didClickIt = true;
});

 apiCall = (url,method,body) => {
    let that = this;
    let token = localStorage.getItem("token");
    var type = url.split("/",2);
    type = type.splice(1);
    let fetchBody;
    switch(type[0]){
      case 'get-all-data':
      case "get-data":
      case "delete":
        fetchBody=undefined;
        break;
      case "insert":
        console.log(body);
        let content = body.split(",",1);
        let author = body.split(",")[1];
        fetchBody={"content":content,"author":author};
        break;
      case "signup":
        let mail = body.split(",",1);
        let password = body.split(",")[1];
        fetchBody={"mail":mail,"password":password}
        break;
      case "login":
        let accountmail = body.split(",",1);
        let accountpassword = body.split(",")[1];
        fetchBody={"mail":accountmail,"password":accountpassword}
        break;
      case "protected":
        fetchBody={"name":body};
        break;      
      default:
      console.log("Nix davon");
        break;
    }
    console.log("API-Call with type of "+type+" to "+url+",with method of "+method+" and this body: "+fetchBody);
    return fetch(new Request('http://localhost:5000'+url,{
      method: method,
      headers: new Headers({
        "Content-Type":"application/json",
        "Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Origin":"http://localhost:3000",
        "Authorization":"Bearer "+token,
      }),
      body: JSON.stringify(fetchBody)
    }))
    .then(function(res){
      return res.json()
    })
    .then(function(res){
      switch(type[0]){
        case "get-all-data":
          console.log('Ein GET_ALL_DATA');
          that.props.onGiveAllData(res);
          break;
        case "insert":
          that.props.onClearInputField();
          that.update();
          break;
        case "delete":
          that.update();
          break;
        case "signup":
          alert(res.message);
          break;
        case "login":
          alert(res.message);
          localStorage.setItem("token",res.token);
          that.props.onSaveToken(res.token,res.username);
          if(res.status === 200){
            that.update();
          }
          break;
        case "protected":
          alert(res.message);
          console.log(res.data)
          break;
        default:
          console.log("err");
          break;
      }
     
    })  
  };
