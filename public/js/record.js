var pathArray;
var pathArray2;
var pathArray3;
var map;

var pts = []; // All the GPS points
var distIndex = 1; // Index for distance calculation
var totalDistance = 0.0; // Total distance travelled
var currentLat = 0.0; // Current latitude
var currentLng = 0.0; // Current longitude
var accuracy = 0.0; // Current accuracy in miles
var minDistance = 0.05; // Minimum distance (miles) between collected points.
var isStarted = false; // Flag tracking the application state.
var map = null; // The map
var markers = []; // Container for the map markers
var positionTimer; // The id of the position timer.

var startRecord = false; // Boolean flag to start recording when pressed


$(document).ready(function() {
    window.initMap = function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {
                lat: 32.879350,
                lng: -117.238559
            },
            zoom: 16
        });

        // Button starts
        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

        // var infoWindow = new google.maps.InfoWindow({map: map});
        var image = 'places.png';

        var currLocMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            icon: image,
            scale: 0.01,
            map: map,
        });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                pts.push(pos);

                currLocMarker.setPosition(pos);

                //infoWindow.setPosition(pos);
                //infoWindow.setContent('Current Location');
                map.setCenter(pos);

                updateCurrLocation();


            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Start Recording';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
            if (!startRecord) {
                controlText.innerHTML = 'Stop Recording';
                startRecord = true;
            } else {

                $.ajax({
                    type: 'POST',
                    url: '/storeroute',
                    data: {
                        "route": pts
                    },
                    success: function(data) {
                        console.log(data);
                    }
                });

                location.href = "/rate";
            }
        });
    }
});


function updateCurrLocation() {
    if (navigator.geolocation) {
        positionTimer = navigator.geolocation.watchPosition(
            function(position) {
                if (startRecord) {
                    pts.push(position);
                    console.log("Curr Loc is:", position);
                    console.log(pts);
                }


                // Track current position
                accuracy = position.coords.accuracy / 609.344; // 609.344 meters per mile
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;

                // Update the status
                //updateStatus();
            },
            function(error) {
                console.log("Something went wrong: ", error);
            }, {
                timeout: (60 * 1000),
                maximumAge: (1000),
                enableHighAccuracy: true
            }
        );

    } else {
        alert("Your browser does not support geo-location.");
    }
}
