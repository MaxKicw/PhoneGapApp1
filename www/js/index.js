/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
       	app.receivedEvent('deviceready');
        console.log("----Device-Ready----");
		navigator.vibrate(300);
    	var options = {frequency: 1000};
   		navigator.accelerometer.watchAcceleration(accelerometerSuccess, onError, options);
		navigator.geolocation.getCurrentPosition(positionSuccess);
		navigator.gyroscope.watchGyroscope(gyroscopeSuccess, gyroscopeError, options);
		navigator.proximity.enableSensor();
		setInterval(function(){
			navigator.proximity.getProximityState(proximitySuccess);
            window.plugin.lightsensor.getReading(lightSuccess);
		}, 1000);
		fetchNetworkConnectionInfo();
		//Pushnotification---Code---Below---------------//
         app.push = PushNotification.init({
            "android": {
                "senderID": "AIzaSyC8e-2FooDXSvaxW2nDxhP9qJfX-mEZMQk"
            },
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });

         app.push.on('registration', function(data) {
             console.log("registration event: " + data.registrationId);
             document.getElementById("regId").innerHTML = data.registrationId;
             var oldRegId = localStorage.getItem('registrationId');
             if (oldRegId !== data.registrationId) {
                 // Save new registration ID
                 localStorage.setItem('registrationId', data.registrationId);
                 // Post registrationId to your app server as the value has changed
             }
         });

         app.push.on('error', function(e) {
             console.log("push error = " + e.message);
         });

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
//------------Daten des Beschleunigungssensors--------------------//

function accelerometerSuccess(acceleration) {
        var node = document.createElement('div');
        document.getElementById('1').innerHTML = '';
        node.innerHTML = '<p>X-Achse :</p>'+acceleration.x+'<p>Y-Achse :</p>'+acceleration.y+'<p>Z-Achse :</p>'+acceleration.z+'<p>Time :</p>'+acceleration.timestamp;
        document.getElementById('1').appendChild(node);
};
function onError(error){
        console.log("---Error--"+error.code+"---MSG---"+error.message);
};

//------------Art der Netzwerkverbindung--------------------//

function fetchNetworkConnectionInfo(){
	console.log("-----Netzwerk-----");
	navigator.vibrate(300);
    var networkType = navigator.network.connection.type;
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
    var node = document.createElement('div');
    node.innerHTML = '<p>Latitude : </p>'+ position.coords.latitude+'<p>Longitude :</p>'+position.coords.longitude+'<p>Höhe :</p>'+position.coords.altitude;
    document.getElementById('3').appendChild(node);
};

//---------Gyroscope----------------------------------//

function gyroscopeSuccess(acceleration) {
	    console.log("-----GYRO-----");
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
        document.getElementById('6').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>Success: "+JSON.stringify(reading);
		document.getElementById('6').appendChild(node);
	      // Output: {"intensity": 25}
};
//-----------------Push-------------------------//
/*function recieveToken(token){
		document.getElementById('7').innerHTML = '';
        var node = document.createElement('div');
      	node.innerHTML = "<p>Success: "+token;
		document.getElementById('7').appendChild(node);
};+/