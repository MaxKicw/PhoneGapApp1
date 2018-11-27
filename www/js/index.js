var app = {
	abfrageAnswer:"",
	pushActivity:"",
	userActivity:"",
	timestamp:"",
	user:"",
	track:true,
	background:false,
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
		document.addEventListener("pause", onPause, false);
		function onPause() {
			app.background = true;
		}
		document.getElementById('track').innerText = 'Keine Daten senden!';
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
			if(app.track){
				app.pushActivity = currentAcitvity;
				app.user = device.uuid;
				const date = moment().format("DD MM YY ");
				const time = moment().format("HH mm ss");
				app.timestamp = moment().format("DD MM YY HH mm ss");
				document.getElementById('q1').classList.add('active');
				document.getElementById('intro').classList.remove('active');
				document.getElementById('frage').innerText = 'Wir haben dir am '+date+' um '+time+' Uhr eine Push-Notification gesendet! Warst du zu diesem Zeitpunkt wirklich '+JSON.stringify(currentAcitvity)+'?';
			}
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
				alert("Error: Etwas ist falsch gelaufen. Bitte melde das den Testleitern!", JSON.stringify(err));
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
var serverURL = 'http://caebus.de/hackathon/testapp/testapp.php';//ServerURL
//---------------Define antwort vars ----------------//
//----------------Antwortfunktionen----------------//
if(app.background){
	document.getElementById('background').innerText = 'Die App ist jetzt bereit!';
}else{
	document.getElementById('background').innerText = 'Die App muss einmal in den Hintergrund gebracht werden!';
}

function trackingToggle(){
	if(app.track){
		app.track = false;
		document.getElementById('track').innerText = 'Wieder Daten senden!';
	}else{
		app.track = true;
		document.getElementById('track').innerText = 'Keine Daten senden!';
	}
}

function abfrageAnswer(answer){
	app.abfrageAnswer = answer;
	document.getElementById('q2').classList.add('active');
	document.getElementById('q1').classList.remove('active');
}

function answer(choice){
	if(choice == "ja"){
		// sendToServer();
		document.getElementById('thanx').classList.add('active');
		document.getElementById('q2').classList.remove('active');
		sendToServer(app.user,app.abfrageAnswer,JSON.stringify(app.pushActivity),app.userActivity,app.timestamp);
	}else{
		document.getElementById('q3').classList.add('active');
		document.getElementById('q2').classList.remove('active');
	}
};
function acitvityCorrection(rightActivity){
		app.userActivity = rightActivity;
		document.getElementById('q3').classList.remove('active');
		document.getElementById('thanx').classList.add('active');
		sendToServer(app.user,app.abfrageAnswer,JSON.stringify(app.pushActivity),app.userActivity,app.timestamp);
		// sendToServer(rightActivity);
}
//---------------JSON-Call------------------------//
function sendToServer(user,abfrage,tracked_activity,timestamp){
		var form = new FormData();
		form.append("user", user);
		form.append("significantmotion1", abfrage);
		form.append("significantmotion2", tracked_activity);
		form.append("timediff", timestamp);
		
		let settings = {
			method:"POST",
			mode:'cors',
			body: form,
		}
		
		let request = new Request(serverURL,settings);

		fetch(request)
		.then((res) => {
			setTimeout(function(){
				document.getElementById('thanx').classList.remove('active');
				document.getElementById('intro').classList.add('active');
			}, 1200);
		});		
};





