var pathArray;
var pathArray2;
var pathArray3;
var path;
var path2;
var path3;
var durationInfoWindow1;
var durationInfoWindow2;
var durationInfoWindow3;
var mapsRoute;
var displayedCancel = false;
var displayedFind = false;

var map;

$(document).ready(function() {

    var comp = decodeURIComponent(datString);
    var data = JSON.parse(comp);

    var destCoords = {};
    var origCoords = {};

    pathArray = data.paths;

    var comp2 = decodeURIComponent(datString2);
    var data2 = JSON.parse(comp2);

    pathArray2 = data2.paths;

    var comp3 = decodeURIComponent(datString3);
    var data3 = JSON.parse(comp3);

    pathArray3 = data3.paths;

    var origCoords;
    var destCoords;


    window.initMap = function initMap() {
        console.log(newFind);
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = 'WALKING';

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {
                lat: 32.879350,
                lng: -117.238559
            },
            zoom: 16
        });
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);

        var origin_input = document.getElementById('origin-input');
        var destination_input = document.getElementById('destination-input');
        var modes = document.getElementById('mode-selector');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete =
            new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);


        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, mode) {
            var radioButton = document.getElementById(id);
            radioButton.addEventListener('click', function() {
                travel_mode = mode;
            });
        }
        setupClickListener('changemode-walking', 'WALKING');
        setupClickListener('changemode-transit', 'TRANSIT');
        setupClickListener('changemode-driving', 'DRIVING');

        function expandViewportToFitPlace(map, place) {
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
        }

        origin_autocomplete.addListener('place_changed', function() {
            var place = origin_autocomplete.getPlace();
            var lat = (place.geometry.location.lat());
            var lng = place.geometry.location.lng();

            origCoords = {lat, lng};

            console.log(origCoords);

            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            expandViewportToFitPlace(map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            origin_place_id = place.place_id;
            route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
        });

        destination_autocomplete.addListener('place_changed', function() {
            var place = destination_autocomplete.getPlace();
            var lat = (place.geometry.location.lat());
            var lng = place.geometry.location.lng();

            destCoords = {lat, lng};


            $.ajax({
                type: 'POST',
                url: '/pickroute',
                data: {
                    "orig": origCoords,
                    "dest": destCoords
                },
                success: function(data) {
                    console.log(data);
                }
            });

            console.log(destCoords);

            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            expandViewportToFitPlace(map, place);




            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            destination_place_id = place.place_id;
            route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
        });




        function route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay) {
            if (!origin_place_id || !destination_place_id) {
                return;
            }
            mapsRoute = directionsService.route({
                origin: {
                    'placeId': origin_place_id
                },
                destination: {
                    'placeId': destination_place_id
                },
                travelMode: travel_mode
            }, function(response, status) {
                if (status === 'OK') {
                    path.setMap(map);
                    path2.setMap(map);
                    path3.setMap(map);
                    durationInfoWindow1 = new google.maps.InfoWindow({
                        content: '10 mins',
                        map: map,
                        position: data.paths[4]
                    });

                    durationInfoWindow2 = new google.maps.InfoWindow({
                        content: '6 mins',
                        map: map,
                        position: data2.paths[4]
                    });

                    durationInfoWindow3 = new google.maps.InfoWindow({
                        content: '8 mins',
                        map: map,
                        position: data3.paths[3]
                    });

                    directionsDisplay.setDirections(null);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }


        //Add paths

        path = new google.maps.Polyline({
            path: pathArray,
            geodesic: true,
            strokeColor: '#f44336',
            strokeOpacity: 1.0,
            strokeWeight: 6
        });



        path2 = new google.maps.Polyline({
            path: pathArray2,
            geodesic: true,
            strokeColor: '#33cc33',
            strokeOpacity: 1.0,
            strokeWeight: 6
        });


        path3 = new google.maps.Polyline({
            path: pathArray3,
            geodesic: true,
            strokeColor: '#ff9933',
            strokeOpacity: 1.0,
            strokeWeight: 6
        });

        path.addListener('click', function() {
            path2.setMap(null);
            path3.setMap(null);
            directionsDisplay.setMap(null);
            durationInfoWindow1.close();
            durationInfoWindow2.close();
            durationInfoWindow3.close();

            if( displayedCancel == false && newFind == true ){
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControlBack(centerControlDiv, map);
              centerControlDiv.index = 1;
              map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
            }

            if( displayedFind == false ) {
              // Button starts
              // Create the DIV to hold the control and call the CenterControl()
              // constructor passing in this DIV.
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControl(centerControlDiv, map);
              centerControlDiv.index = 1;
              map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
              //Button ENds
              displayedFind = true
            }

        });
        path2.addListener('click', function() {
            path.setMap(null);
            path3.setMap(null);
            directionsDisplay.setMap(null);
            durationInfoWindow1.close();
            durationInfoWindow2.close();
            durationInfoWindow3.close();

            if( displayedCancel == false && newFind == true ){
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControlBack(centerControlDiv, map);
              centerControlDiv.index = 1;
              map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
              console.log(map.controls[google.maps.ControlPosition.BOTTOM_CENTER])
            }

            if( displayedFind == false ) {
              // Button starts
              // Create the DIV to hold the control and call the CenterControl()
              // constructor passing in this DIV.
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControl(centerControlDiv, map);
              centerControlDiv.index = 1;
              map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
              displayedFind = true
              //Button ENds
            }
        });
        path3.addListener('click', function() {
            path2.setMap(null);
            path.setMap(null);
            directionsDisplay.setMap(null);
            durationInfoWindow1.close();
            durationInfoWindow2.close();
            durationInfoWindow3.close();

            if( displayedCancel == false && newFind == true ){
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControlBack(centerControlDiv, map);
              centerControlDiv.index = 1;
              map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
            }

            if( displayedFind == false ) {
              // Button starts
              // Create the DIV to hold the control and call the CenterControl()
              // constructor passing in this DIV.
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControl(centerControlDiv, map);
              centerControlDiv.index = 1;
              map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
              //Button ENds
              displayedFind = true
            }
        });

        /*
        path.addListener('click', removePaths());
        path2.addListener('click', removePaths());
        path3.addListener('click', removePaths());


        function removePaths() {
            path.setMap(null);
            path2.setMap(null);
            path3.setMap(null);
            directionsDisplay.setMap(null);
            durationInfoWindow1.close();
            durationInfoWindow2.close();
            durationInfoWindow3.close();

        }
        */



        //path.setMap(map);
        //path2.setMap(map);
        //path3.setMap(map);

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

                currLocMarker.setPosition(pos);


                map.setCenter(pos);

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
        controlUI.setAttribute("id", "finishButton");
        controlUI.style.backgroundColor = '#2196f3';
        controlUI.style.border = '2px solid #1e88e5';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click if you are finished';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = '#ffffff';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Finished';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
            ga.send('send', 'event', 'finish', 'click');
            location.href = "/rate";
        });
    }

    function CenterControlBack(controlDiv, map) {

        displayedCancel = true;

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#FF0000';
        controlUI.style.border = '2px solid #1e88e5';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click if you to go back';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = '#ffffff';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Cancel';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          path2.setMap(map);
          path3.setMap(map);
          path.setMap(map);
          displayedCancel = false;
          displayedFind = false;
          map.controls[google.maps.ControlPosition.BOTTOM_CENTER].pop();
          map.controls[google.maps.ControlPosition.BOTTOM_CENTER].pop();
        });
    }



})


