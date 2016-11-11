var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var data = require('./GeiselToPines.json')
var data2 = require('./GeiselToPines2.json')
var data3 = require('./GeiselToPines3.json')
var firebase = require("firebase");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA0Ks_7EwNf03gG0jsShrfn0Q-5uu9H890",
    authDomain: "campusroutes-1477102791866.firebaseapp.com",
    databaseURL: "https://campusroutes-1477102791866.firebaseio.com",
    storageBucket: "campusroutes-1477102791866.appspot.com",
    messagingSenderId: "430583292708"
};
firebase.initializeApp(config);



app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', 'views');
app.set('view engine', 'pug');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
    response.render('index', {
        title: 'Homepage'
    });
});

app.post('/pickroute', function(request, response) {

  var origCoords = request.body.orig;
  var destCoords = request.body.dest;

  console.log(origCoords);
  console.log(destCoords);


  var firebaseRef = firebase.database().ref();
  response.send("Test")
});

app.post('/storeroute', function(request, response) {
  console.log(request.body.route);
  var firebaseRef = firebase.database().ref();
  firebaseRef.child('paths').push().set(request.body.route);
});

app.get('/test', function(request, response) {


    response.render('fireTest', {
        title: 'Homepage',
        message: 'Yo Yo'
    });
});

app.get('/select', function(request, response) {
    response.render('select', {
        title: 'Select an Option',
    });
});



app.get('/record', function(request, response) {
    response.render('record', {
        title: 'Record a Route',
        data: JSON.stringify(data),
        data2: JSON.stringify(data2),
        data3: JSON.stringify(data3)
    });
});

app.get('/find', function(request, response) {
    response.render('find', {
        title: 'Find a route',
        data: JSON.stringify(data),
        data2: JSON.stringify(data2),
        data3: JSON.stringify(data3)
    });
});

app.get('/rate', function(request, response) {
    response.render('rate', {
        title: 'Rate your Route',
    });
});

app.get('/navigate', function(request, response) {

    console.log(request.query);


    var locationName = request.query.locationSearch;


    response.render('navigate', {
        title: 'Follow These Directions',
        locationName: locationName,
    });
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
