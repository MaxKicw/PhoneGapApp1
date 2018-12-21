// Alles geht außer der Drecks nachrichtengenerator 
var app = {
	user_answer:"",
	calcNowTimestamp:"",
	trackedActivity:"",
	pushAcitvity:"",
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
		document.getElementById('bg-btn').style.backgroundColor = "#46A364";
	},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
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
