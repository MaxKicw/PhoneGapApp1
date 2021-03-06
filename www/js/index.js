// Workssss
var app = {
	user_answer:"",
	calcNowTimestamp:"",
	trackedActivity:"",
	pushActivity:"",
	userActivity:{STILL:undefined,ON_FOOT:undefined,IN_VEHICLE:undefined,RUNNING:undefined,WALKING:undefined,ON_BICYLE:undefined,TILTING:undefined,UNKNOWN:undefined},
	timestamp_push:{},
	verzögerungsGrund:"",
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
		document.getElementById('status_icon_bg').style.backgroundColor = "#46A364";
		document.getElementById('status_icon_bg').classList.add('ready');
	},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//For JSON Can
		cordova.plugins.diagnostic.isLocationAuthorized(function(enabled){
			console.log("Location is " + (enabled ? "enabled" : "disabled"));
			if(!enabled){
			  cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
				  console.log("Authorization status is now: "+status);
			  }, function(error){
				  console.error(error);
			  });
			}
		}, function(error){
			console.error("The following error occurred: "+error);
		});
		//
		document.getElementById('track').innerText = 'Klicke damit keine Daten gesendet werden!';
		document.getElementById('track-btn').style.backgroundColor = "#46A364";
		app.receivedEvent('deviceready');
		document.getElementById('status_icon_app').style.backgroundColor = "#46A364";
		document.getElementById('status_icon_app').classList.add('ready');
		// Only with First time registration - For Pushbot
		window.plugins.PushbotsPlugin.initialize("5d04d0adb7941225fc3993b5", {"android":{"sender_id":"825046589633"}});
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
				app.pushActivity = app.trackedActivity;
				let messageActivity = app.pushActivity;
				app.timestamp_push.date = moment().format("DD.MM.YY ");
				app.timestamp_push.time = moment().format("HH:mm:ss");
				app.calcNowTimestamp = new moment();
				document.getElementById('q1').classList.add('active');
				document.getElementById('intro').classList.remove('active');
				document.getElementById('frage').innerText = 'Wir haben dir um '+app.timestamp_push.time+' am '+app.timestamp_push.date+' Uhr eine Push-Nachricht zugestellt! Laut unserer Acitvity-Tracking-App hast Du zu diesem Zeitpunkt folgendes gemacht: ';
				let highestCount = 0;
				let highestKey;
				for (var x in messageActivity) {
					if(messageActivity[x] >= highestCount){
						highestCount = messageActivity[x];
						highestKey = x;
					}
				}
				switch(highestKey){
					case "STILL":
						document.getElementById('trackedActivity').innerText = "Das Smartphone war unbewegt.";
						break;
					case "WALKING":
						document.getElementById('trackedActivity').innerText = "Du warst zu Fuß unterwegs.";
						break;
					case "ON_FOOT":
						document.getElementById('trackedActivity').innerText = "Du warst zu Fuß unterwegs.";
						break;
					case "IN_VEHICLE":
						document.getElementById('trackedActivity').innerText = "Du warst in einem Fahrzeug unterwegs.";
						break;
					case "RUNNING":
						document.getElementById('trackedActivity').innerText = "Du bist schnell gegangen / wars joggen.";
						break;
					case "ON_BICYLE":
						document.getElementById('trackedActivity').innerText = "Du war auf dem Fahrrad unterwegs.";
						break;
					case "TILTING":
						document.getElementById('trackedActivity').innerText = "Du hattes das Smartphone in der Hand.";
						break;
					case "UNKNOWN":
						document.getElementById('trackedActivity').innerText = "Es konnte keine Aktivität erfasst werden!";
						break;
					default:
						document.getElementById('trackedActivity').innerText = "Es konnte keine Aktivität erfasst werden!";
						break;
				}
			}
		});

		// Setup Activity Recognition Plugin
		var bgLocationServices =  window.plugins.backgroundLocationServices;
		bgLocationServices.configure({
			//Both
			desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
			distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
			debug: false, // <-- Enable to show visual indications when you receive a background location update
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
		}, 1000);
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
		document.getElementById('track-btn').style.backgroundColor = "#ce2c2c";

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
	// alert(diff);
	// Und Zeitdifferenz
	if(app.user_answer === "Ja" && diff <= 0 ){
		document.getElementById('q4').classList.add('active');
		document.getElementById('q1').classList.remove('active');
	}else if(app.user_answer === "Ja" && diff >= 5){
		document.getElementById('verzugNachricht').innerHTML = "Zwischen dem Versand der Nachricht vom "+app.timestamp_push.date+" um "+app.timestamp_push.time+" und dem Öffnen durch Dich sind mehr als 5 Minuten vergangen. Was war der Grund dafür?"
		document.getElementById('q2').classList.add('active');
		document.getElementById('q1').classList.remove('active');
	}else{
		document.getElementById('falscheAktivitätNachricht').innerHTML = "Wenn die App die Aktivität am "+app.timestamp_push.date+" um "+app.timestamp_push.time+" falsch ermittelt hat, welche der folgenden Aktivitätsbeschreibungen trifft ansonsten am ehesten zu?"
		document.getElementById('q3').classList.add('big');
		document.getElementById('q1').classList.remove('active');
	}
}

function answer(choice){
	app.verzögerungsGrund = choice;
	document.getElementById('q4').classList.add('active');
	document.getElementById('q2').classList.remove('active');
};
function acitvityCorrection(rightActivity){
	switch(rightActivity){
		case 'STILL':
			app.userActivity.STILL = 100;
			break;
		case 'ON_FOOT':
			app.userActivity.ON_FOOT = 100;
			break;
		case 'IN_VEHICLE':
			app.userActivity.IN_VEHICLE = 100;
			break;
		case 'RUNNING':
			app.userActivity.RUNNING = 100;
			break;
		case 'WALKING':
			app.userActivity.WALKING = 100;
			break;
		case 'ON_BICYLE':
			app.userActivity.ON_BICYCLE = 100;
			break;
		case 'TILTING':
			app.userActivity.TILTING = 100;
			break;
		case 'UNKNOWN':
			app.userActivity.UNKNOWN = 100;
			break;
	}
	if(app.timediff >= 5){
		document.getElementById('verzugNachricht').innerHTML = "Zwischen dem Versand der Nachricht vom "+app.timestamp_push.date+" um "+app.timestamp_push.time+" und dem Öffnen durch Dich sind mehr als 5 Minuten vergangen. Was war der Grund dafür?";
		document.getElementById('q2').classList.add('active');
		document.getElementById('q3').classList.remove('big');
	}else{
		document.getElementById('q4').classList.add('active');
		document.getElementById('q3').classList.remove('big');
	}
	
}

function shouldSend(choice){
	if(choice === 'Ja'){
		sendToServer();
		document.getElementById("dankeText").innerHTML = "Die Daten wurden an die Hochschule gesendet!";
		document.getElementById('q5').classList.add('active');
		document.getElementById('q4').classList.remove('active');
	}else{
		document.getElementById("dankeText").innerHTML = "Die Daten werden NICHT an die Hochschule gesendet!";
		document.getElementById('q5').classList.add('active');
		document.getElementById('q4').classList.remove('active');
		resetLocalData();
		setTimeout(function(){
			document.getElementById('q5').classList.remove('active');
			document.getElementById('intro').classList.add('active');
		}, 1200);
	}
}
//---------------JSON-Call------------------------//
function showData(){
	alert("Deine Geräte-ID: "+app.uuid);
	alert("Die automatisch erkannte Aktivität: "+JSON.stringify(app.pushActivity));
	alert("Hat diese gepasst?: "+app.user_answer);
	alert("Falls Nein -> Deine wahre Aktivität: "+JSON.stringify(app.userActivity));
}
function sendToServer(){
		// alert("Send stuff!");
		let timestamp_send_date = moment().format("DD.MM.YY");
		let timestamp_send_time = moment().format("HH:mm:ss");
		var form = new FormData();
		form.append("UUID", app.uuid);
		form.append("TIMESTAMP_PUSH_DATE", app.timestamp_push.date);
		form.append("TIMESTAMP_PUSH_TIME", app.timestamp_push.time);
		form.append("USER_ANSWER", app.user_answer);
		form.append("USER_DELAY_REASON",app.verzögerungsGrund);
		// Tracked Variablen
		form.append("TRACKED_ACTIVITY_ON_FOOT", app.pushActivity.ON_FOOT);
		form.append("TRACKED_ACTIVITY_IN_VEHICLE", app.pushActivity.IN_VEHICLE);
		form.append("TRACKED_ACTIVITY_RUNNING", app.pushActivity.RUNNING);
		form.append("TRACKED_ACTIVITY_WALKING", app.pushActivity.WALKING);
		form.append("TRACKED_ACTIVITY_ON_BICYCLE", app.pushActivity.ON_BICYLE);
		form.append("TRACKED_ACTIVITY_STILL", app.pushActivity.STILL);
		form.append("TRACKED_ACTIVITY_TILTING", app.pushActivity.TILTING);
		form.append("TRACKED_ACTIVITY_UNKNOWN", app.pushActivity.UNKNOWN);
		// Usereingabe Variablen
		form.append("USER_ACTIVITY_ON_FOOT", app.userActivity.ON_FOOT);
		form.append("USER_ACTIVITY_IN_VEHICLE", app.userActivity.IN_VEHICLE);
		form.append("USER_ACTIVITY_RUNNING", app.userActivity.RUNNING);
		form.append("USER_ACTIVITY_WALKING", app.userActivity.WALKING);
		form.append("USER_ACTIVITY_ON_BICYCLE", app.userActivity.ON_BICYLE);
		form.append("USER_ACTIVITY_STILL", app.userActivity.STILL);
		form.append("USER_ACTIVITY_TILTING", app.userActivity.TILTING);
		form.append("USER_ACTIVITY_UNKNOWN", app.userActivity.UNKNOWN);
		form.append("TIMESTAMP_SEND_DATE", timestamp_send_date);
		form.append("TIMESTAMP_SEND_TIME", timestamp_send_time);
		
		let settings = {
			method:"POST",
			mode:'cors',
			body: form,
		}
		
		let request = new Request(serverURL,settings);

		fetch(request)
		.then((res) => {
			setTimeout(function(){
				document.getElementById('q5').classList.remove('active');
				document.getElementById('intro').classList.add('active');
				resetLocalData();
			}, 1200);
		});	
};

function resetLocalData(){
	app.user_answer="";
	app.calcNowTimestamp="";
	app.trackedActivity="";
	app.userActivity={STILL:undefined,ON_FOOT:undefined,IN_VEHICLE:undefined,RUNNING:undefined,WALKING:undefined,ON_BICYLE:undefined,TILTING:undefined,UNKNOWN:undefined};
	app.timestamp_push={};
	app.pushActivity="";
	app.verzögerungsGrund = "";
	app.timediff = "";
}




