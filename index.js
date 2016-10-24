var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', 'views');
app.set('view engine', 'pug');

app.get('/', function(request, response) {
  response.render('index',
            { title: 'Homepage', message: 'Yo Yo'});
});

app.get('/select', function(request, response) {
  response.render('select',
            { title: 'Select an Option',});
});

app.get('/record', function(request, response) {
  response.render('record',
            { title: 'Record a Route',});
});

app.get('/find', function(request, response) {
  response.render('find',
            { title: 'Find a route',});
});

app.get('/rate', function(request, response) {
  response.render('rate',
            { title: 'Rate your Route',});
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
