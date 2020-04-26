// server.js
// setting up the variables and using require to pull the packages that will help us connect to the browser?
// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8000; //localhost url, able to change if need be
const MongoClient = require('mongodb').MongoClient
//server node modules. In order to run
var mongoose = require('mongoose'); //Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.
var passport = require('passport'); //Passport is authentication middleware for Node. js.
var flash = require('connect-flash'); //FlashJS is JavaScript graphics and game development engine with API similar to Flash one

var morgan = require('morgan'); //Morgan: is another HTTP request logger middleware for Node. js.
var cookieParser = require('cookie-parser'); //cookie-parser is a middleware which parses cookies attached to the client request object.
// bodyParser allows us to select only the information that we want to grab
const Nexmo = require('nexmo')
let nexmo = new Nexmo({
  apiKey: '3797d477',
  apiSecret: 'nXuD9v2nzWm4t5iT'
},{debug:true})

app.post('/', (req, res) => {
  // res.send(req.body);
  console.log(req.body);
  const { number, text} = req.body;

  nexmo.message.sendSms(
    '19564482986', number, text, { type: 'unicode' },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        const { messages } = responseData;
        const { ['message-id']: id, ['to']: number, ['error-text']: error } = messages[0];
        console.dir(responseData);
        // Get data from response
        const data = {
          id,
          number,
          error
        };
        // emmit to the client
        io.emit('smsStatus', data);
      }
    }
  );
});

var bodyParser = require('body-parser');
// In order to get access to the post data we have to use body-parser. Basically what the body-parser is which allows express to read the body and then parse that into a Json object that we can understand.
var session = require('express-session');

var configDB = require('./config/database.js'); // this is the file you need to go to connect to your own personal server

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => { // .connect is a method used for mongoDB to connect to your database
  if (err) return console.log(err)
  console.log("connected to db")
  db = database
  require('./app/routes.js')(app, passport, db, nexmo);
}); // connect to our database

require('./config/passport')(passport, nexmo); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'rcbootcamp2019a', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

function rad(x) {
  return x * Math.PI / 180;
}

function find_closest_marker(event) {
  var lat = event.latLng.lat();
  var lng = event.latLng.lng();
  var R = 6371; // radius of earth in km
  var distances = [];
  var closest = -1;
  for (i = 0; i < map.markers.length; i++) {
    var mlat = map.markers[i].position.lat();
    var mlng = map.markers[i].position.lng();
    var dLat = rad(mlat - lat);
    var dLong = rad(mlng - lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    distances[i] = d;
    if (closest == -1 || d < distances[closest]) {
      closest = i;
    }
  }

  alert(map.markers[closest].title);
}
// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
