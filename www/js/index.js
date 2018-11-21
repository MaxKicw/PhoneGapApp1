let abfrageAnswer;
let pushActivity;
let userActivity;
let timestamp;
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
		// Only with First time registration - For Pushbot
		window.plugins.PushbotsPlugin.initialize("5b151b591db2dc70b473dcb0", {"android":{"sender_id":"687741121085"}});
		window.plugins.PushbotsPlugin.on("registered", 		function(token){
			console.log("Registration Id:" + token);
		});
	
			//Get user registrationId/token and userId on PushBots, with evey launch of the app even launching with notification
			
		window.plugins.PushbotsPlugin.on("user:ids", 	function(data){
			console.log("user:ids" + JSON.stringify(data));
		});
			
			//Diese Funktion wird ausgeführt, wenn die App eine Nachricht erhalten hat
			
		window.plugins.PushbotsPlugin.on("notification:received", function(data){
			alert("Works");
			alert("Die Aktivität zum Zeitpunkt des Pushes: "+JSON.stringify(currentAcitvity));
			pushActivity = currentAcitvity;
			const date = moment().format("DD MM YY ");
			const time = moment().format("HH mm ss");
			timestamp = moment().format("DD MM YY HH mm ss");
			document.getElementById('abfrage').classList.add('active');
			document.getElementById('frage').innerText = 'Wir haben dir am '+date+' um '+time+' Uhr eine Push-Notification gesendet! Warst du zu diesem Zeitpunkt wirklich '+JSON.stringify(currentAcitvity)+'?';
		});

		// Setup Activity Recognition Plugin
		var bgLocationServices =  window.plugins.backgroundLocationServices;
		bgLocationServices.configure({
			//Both
			desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
			distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
			debug: true, // <-- Enable to show visual indications when you receive a background location update
			interval: 9000, // (Milliseconds) Requested Interval in between location updates.
			useActivityDetection: true, // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)
			
			//Android Only
			notificationTitle: 'BG Plugin', // customize the title of the notification
			notificationText: 'Tracking', //customize the text of the notification
			fastestInterval: 5000 // <-- (Milliseconds) Fastest interval your app / server can handle updates
			
	   });
	   bgLocationServices.start();
		// Wird alle 1000ms ausgeführt / Welche Aktivität machst du?
		setInterval(function(){
			bgLocationServices.registerForActivityUpdates(function(activities) {
				currentAcitvity = activities
				// document.getElementById('activity').innerHTML = "<p Current Activity: >"+JSON.stringify(currentAcitvity[0])+"</p>";
		   }, function(err) {
				alert("Error: Something went wrong", JSON.stringify(err));
		   });
		}, 300);
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
var serverURL = 'https://calm-wildwood-42488.herokuapp.com/response';//ServerURL
//---------------Define antwort vars ----------------//
//----------------Antwortfunktionen----------------//
function abfrageAnswer(answer){
	abfrageAnswer = answer;
	alert(abfrageAnswer);
	document.getElementById('popup').classList.add('active');
	document.getElementById('abfrage').classList.remove('active');
}

function answer(choice){
	if(choice == "ja"){
		document.getElementById('popup').classList.remove('active');
		// sendToServer();
		alert("Erhaltene Informationen: "+abfrageAnswer+", "+pushActivity+", "+rightActivity+", "+timestamp);
	}else{
		document.getElementById('whichone').classList.add('active');
		alert("More");
	}
};
function acitvityCorrection(rightActivity){
		userActivity = rightActivity;
		alert("Erhaltene Informationen: "+abfrageAnswer+", "+pushActivity+", "+rightActivity+", "+timestamp);
		// sendToServer(rightActivity);
}
//---------------JSON-Call------------------------//
function sendToServer(rightActivity){
		fetch(serverURL, {
			method: 'POST',
			body: JSON.stringify({significantmotion1:pushActivity,significantmotion2:rightActivity,timediff:1234}), // data can be `string` or {object}!
			headers:{
			  'Content-Type': 'application/json'
			}
		  }).then(res => res.json())
		  .then(response => console.log('Success:', JSON.stringify(response)))
		  .catch(error => console.error('Error:', error));
};





