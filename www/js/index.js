var app = {
	user_answer:"",
	calcNowTimestamp:"",
	trackedActivity:"",
	userActivity:{},
	timestamp_push:"",
	uuid:"",
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
		document.addEventListener('pause', this.onPause, false);
	},
	onPause: function(){
		app.background = true;
		document.getElementById('background').innerText = 'Die App wurde in den Hintergrund gebracht!';
		document.getElementById('bg-btn').style.backgroundColor = "#46A364";
	},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//For JSON Can
		
		//
		document.getElementById('track').innerText = 'Klicke damit keine Daten gesendet werden!';
		document.getElementById('track-btn').style.backgroundColor = "#46A364";
		app.receivedEvent('deviceready');
		document.getElementById('rdy-btn').style.backgroundColor = "#46A364";
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
				app.uuid = device.uuid;
				const date = moment().format("DD.MM.YY ");
				const time = moment().format("HH:mm");
				app.calcNowTimestamp = new moment();
				app.timestamp_push = moment().format("DD.MM.YY HH:mm:ss");
				document.getElementById('q1').classList.add('active');
				document.getElementById('intro').classList.remove('active');
				document.getElementById('frage').innerText = 'Wir haben dir um '+time+' am '+date+' Uhr eine Push-Nachricht zugestellt! Laut unserer Acitvity-Tracking-App hast Du zu diesem Zeitpunkt folgendes gemacht: ';
				let hightestValue = Object.keys(app.trackedActivity).reduce(function(a, b){ return obj[a] > obj[b] ? a : b });
				let activityMessage;
				alert(JSON.stringify(app.trackedActivity));
				switch(hightestValue){
					case "STILL":
						activityMessage = "Das Handy lag nicht bei dir.";
						break;
					case "ON_FOOT":
						activityMessage = "Du standest aufrecht.";
						break;
					case "IN_VEHICLE":
						activityMessage = "Du warst in einem Fahrzeug.";
						break;
					case "RUNNING":
						activityMessage = "Du warst Joggen.";
						break;
					case "WALKING":
						activityMessage = "Du warst zu Fuß.";
						break;
					case "ON_BICYLE":
						activityMessage = "Du war auf dem Fahrrad.";
						break;
					case "TILTING":
						activityMessage = "Du saßst mit dem Handy in der Hand.";
						break;
					case "UNKNOWN":
						activityMessage = "Es konnte keine Aktivität erfasst werden!";
						break;
					default:
						activityMessage = "Es konnte keine Aktivität erfasst werden!";
						break;
				}
				document.getElementById('trackedActivity').innerText = activityMessage;
				document.getElementById('q1').classList.add('active');
				document.getElementById('intro').classList.remove('active');
				document.getElementById('frage').innerText = 'Wir haben dir um '+app.timestamp_push.date+' am '+app.timestamp_push.time+' Uhr eine Push-Nachricht zugestellt! Laut unserer Acitvity-Tracking-App hast Du zu diesem Zeitpunkt folgendes gemacht: ';
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
				app.trackedActivity = activities
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
function trackingToggle(){
	if(app.track){
		app.track = false;
		document.getElementById('track').innerText = 'Klicke damit Daten gesendet werden!';
		document.getElementById('track-btn').style.backgroundColor = "#FF0000";

	}else{
		app.track = true;
		document.getElementById('track').innerText = 'Klicke damit keine Daten gesendet werden!';
		document.getElementById('track-btn').style.backgroundColor = "#46A364";
	}
}

function user_answer(answer){
	app.user_answer = answer;
	let now = new moment();
	let diff = moment.duration(now.diff(app.calcNowTimestamp));
	diff = diff._data.minutes;
	app.timediff = diff;
	alert("Hi");
	alert(diff);
	// Und Zeitdifferenz
	if(app.user_answer === "Ja" && diff <= 4 ){
		document.getElementById('q4').classList.add('active');
		document.getElementById('q1').classList.remove('active');
	}else if(app.user_answer === "Ja" && diff >= 5){
		document.getElementById('verzugNachricht').innerHTML = "Zwischen dem Versand der Nachricht vom "+app.timestamp_push.date+" um "+app.timestamp_push.time+" und dem Öffnen durch Dich sind mehr als 5 Minuten vergangen. Was war der Grund dafür?"
		document.getElementById('q2').classList.add('active');
		document.getElementById('q1').classList.remove('active');
	}else{
		document.getElementById('falscheAktivitätNachricht').innerHTML = "Wenn die App die Aktivität am "+app.timestamp_push.date+" um "+app.timestamp_push.time+" falsch ermittelt hat, welche der folgenden Aktivitätsbeschreibungen trifft ansonsten am ehesten zu?"
		document.getElementById('q3').classList.add('active');
		document.getElementById('q1').classList.remove('active');
	}
}

function answer(choice){
	if(choice == "ja"){
		// sendToServer();
		let now = new moment();
		let diff = moment.duration(now.diff(app.calcNowTimestamp));
		document.getElementById('diff').innerText = app.calcNowTimestamp + " / "+now+" / "+diff;
		document.getElementById('thanx').classList.add('active');
		document.getElementById('q2').classList.remove('active');
		sendToServer(app.uuid,app.timestamp_push,app.user_answer,app.trackedActivity,app.userActivity);
	}else{
		document.getElementById('q3').classList.add('big');
		document.getElementById('q2').classList.remove('active');
	}
};
function acitvityCorrection(rightActivity){
		switch(rightActivity){
			case "STILL":
				app.userActivity.STILL = 100;
				break;
			case "ON_FOOT":
				app.userActivity.ON_FOOT = 100;
				break;
			case "IN_VEHICLE":
				app.userActivity.IN_VEHICLE = 100;
				break;
			case "RUNNING":
				app.userActivity.RUNNING = 100;
				break;
			case "WALKING":
				app.userActivity.WALKING = 100;
				break;
			case "ON_BICYLE":
				app.userActivity.ON_BICYLE = 100;
				break;
			case "TILTING":
				app.userActivity.TILTING = 100;
				break;
			case "UNKNOWN":
				app.userActivity.UNKNOWN = 100;
				break;
		}
		document.getElementById('q3').classList.remove('big');
		document.getElementById('thanx').classList.add('active');
		sendToServer(app.uuid,app.timestamp_push,app.user_answer,app.trackedActivity,app.userActivity);
		// sendToServer(rightActivity);
}
//---------------JSON-Call------------------------//
function sendToServer(uuid,timestamp_push,user_answer,trackedActivity,userActivity){
		let timestamp_send = moment().format("DD.MM.YY HH:mm:ss");
		var form = new FormData();
		form.append("UUID", uuid);
		form.append("TIMESTAMP_PUSH", timestamp_push);
		form.append("USER_ANSWER", user_answer);
		// Tracked Variablen
		form.append("TRACKED_ACTIVITY_ON_FOOT", trackedActivity.ON_FOOT);
		form.append("TRACKED_ACTIVITY_IN_VEHICLE", trackedActivity.IN_VEHICLE);
		form.append("TRACKED_ACTIVITY_RUNNING", trackedActivity.RUNNING);
		form.append("TRACKED_ACTIVITY_WALKING", trackedActivity.WALKING);
		form.append("TRACKED_ACTIVITY_ON_BICYCLE", trackedActivity.ON_BICYLE);
		form.append("TRACKED_ACTIVITY_STILL", trackedActivity.STILL);
		form.append("TRACKED_ACTIVITY_TILTING", trackedActivity.TILTING);
		form.append("TRACKED_ACTIVITY_UNKNOWN", trackedActivity.UNKNOWN);
		// Usereingabe Variablen
		form.append("USER_ACTIVITY_ON_FOOT", userActivity.ON_FOOT);
		form.append("USER_ACTIVITY_IN_VEHICLE", userActivity.IN_VEHICLE);
		form.append("USER_ACTIVITY_RUNNING", userActivity.RUNNING);
		form.append("USER_ACTIVITY_WALKING", userActivity.WALKING);
		form.append("USER_ACTIVITY_ON_BICYCLE", userActivity.ON_BICYLE);
		form.append("USER_ACTIVITY_STILL", userActivity.STILL);
		form.append("USER_ACTIVITY_TILTING", userActivity.TILTING);
		form.append("USER_ACTIVITY_UNKNOWN", userActivity.UNKNOWN);
		form.append("TIMESTAMP_SEND", timestamp_send);
		
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





