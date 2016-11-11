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
        title: 'Homepage',
        message: 'Yo Yo'
    });
});

app.post('/storeroute', function(request, response) {

  console.log(request.body.route);
  var firebaseRef = firebase.database().ref();
  var childName;




});

app.get('/test', function(request, response) {

    var firebaseRef = firebase.database().ref();
    var newPaths = 0; 
    firebaseRef.on("value", function(snapshot) {
        newPaths = (snapshot.val().numPaths);
        }, function (error) {
           console.log("Error: " + error.code);
    });

    newPaths++;
    console.log(newPaths);


    firebaseRef.child('numPaths').set(newPaths);


   





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
