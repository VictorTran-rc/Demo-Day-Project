//Where CRUD is happening. Create, Result, Update, Delete
const Favorites = require('./models/favorites')
const mongoose = require('mongoose')
const axios = require('axios')
const Nexmo = require('nexmo')

module.exports = function(app, passport, db, nexmo, objectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  //Result
  app.get('/', function(req, res) {
    //tells us what page to render in the dom
    res.render('index.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/index', function(req, res) {
    //tells us what page to render in the dom
    res.render('index.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  //home page to tabs link
  app.get('/favorites', function(req, res) {
    //tells us what page to render in the dom
    res.render('favorites.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/nearby', function(req, res) {
    //tells us what page to render in the dom
    res.render('nearby.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/browse', function(req, res) {
    //tells us what page to render in the dom
    res.render('browse.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });

  app.get('/blueline', function(req, res) {
    //tells us what page to render in the dom
    res.render('blueline.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });

  app.get('/redline', function(req, res) {
    //tells us what page to render in the dom
    res.render('redline.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });

  app.get('/greenlineB', function(req, res) {
    //tells us what page to render in the dom
    res.render('greenlineB.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/greenlineC', function(req, res) {
    //tells us what page to render in the dom
    res.render('greenlineC.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/greenlineD', function(req, res) {
    //tells us what page to render in the dom
    res.render('greenlineD.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/greenlineE', function(req, res) {
    //tells us what page to render in the dom
    res.render('greenlineE.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });

  app.get('/orangeline', function(req, res) {
    //tells us what page to render in the dom
    res.render('orangeline.ejs', {
      user: req.user,
      isLoggedIn: (req.user != null) ? (true) : (false)
    });
  });
  app.get('/findClosestStation', function(req, res) {
    //tells us what page to render in the dom
    axios.get('https://api-v3.mbta.com/stops?route=Red,Blue,Green-B,Green-C,Green-D,Green-E,Mattapan,Orange')
      .then(response => {
        const sourceLat = req.query["sourceLat"]
        const sourceLng = req.query["sourceLng"]

        function rad(x) {
          return x * Math.PI / 180;
        }
        var R = 6371; // radius of earth in km
        var distances = [];
        var closest = -1;
        for (i = 0; i < response.data.data.length; i++) {
          var mlat = response.data.data[i].attributes.latitude;
          var mlng = response.data.data[i].attributes.longitude;
          var dLat = rad(mlat - sourceLat);
          var dLong = rad(mlng - sourceLng);
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(sourceLat)) * Math.cos(rad(sourceLat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c;
          distances[i] = d;
          if (closest == -1 || d < distances[closest]) {
            closest = i;
          }
        }
        var closestStation = response.data.data[closest]
        res.send(closestStation)
      })
      .catch(err => console.log(err));
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    //get request grabs profile function
    // routes js line 14-19 is our request. GET is what we use to achieve this
    db.collection('favorites').find({ email: req.user.local.email }).toArray((err, result) => {
      //reuest to grabbatabase collection named message,into array
      if (err) return console.log(err)
      console.log(result)
      //conditional console logged for error
      res.render('profile.ejs', {
        user: req.user,
        favorites: result,
        isLoggedIn: (req.user != null) ? (true) : (false)
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================
  //Create
  app.post('/messages', (req, res) => {
    //creating a message with the username ( email) the message they post, thumbUp and thumbDown and each time you press submit, this is activated and saves to the database
    //console.log redirects you back to profile.ejs (refresh)
    db.collection('user').save({
      name: req.body.name,
      msg: req.body.msg,
      thumbUp: 0,
      thumbDown: 0
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      //refreshing the page, which will then display with the latest message added.
      res.redirect('/profile')
    })
  })

  app.post('/favorites', (req, res) => {
    console.log(req.user);
    const newFavorite = new Favorites({
      email: req.user.local.email,
      start: req.body.start,
      end: req.body.end,
    })
    newFavorite.save()
      .then(() => {
        console.log('newFavoriteSavedTo', newFavorite);
        let nexmo = new Nexmo({
          apiKey: '3797d477',
          apiSecret: 'nXuD9v2nzWm4t5iT'
        },{debug:true})
        const number = req.user.phoneNumber
        const text = `https://www.google.com/maps/dir/${req.body.start}/${req.body.end}/@42.3211926,-71.0893502`
        const sendSms = req.body.sendSms
        console.log(number, text, sendSms, "number", "text", "sendSms");
        if( sendSms === true){
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
            }
          }
        )}
      })
      .catch(err => console.log("favoritesFailed",err))
  })

  // app.post('/favorites', (req, res) => {
  //   console.log(req.user);
  //   const sendMessage = new message({
  //     email: req.user.local.email,
  //     number: req.body.number,
  //     message: req.body.message,
  //   })
  //   newFavorite.save()
  //     .then(() => {
  //       res.render('index')
  //     })
  //     .catch(err => console.log(err))
  // })
  //When the user clicks UP/Down etc , a PUT/Update will happen
  app.put('/messages', (req, res) => {
    db.collection('messages')
      .findOneAndUpdate({
        name: req.body.name,
        msg: req.body.msg
      }, {
        //relates to put /messages
        //goes into the array andgoes into individualnames of the constructors.
        //need to perfect..
        // The $set operator replaces the value of a field with the specified value.
        $set: {

          thumbUp: req.body.thumbUp + 1
        }
      }, {
        // sort is an arrayfunction tosort the order [bottom to top: -1]
        //upsert [insert & update that specific thing [thumbsUp]]
        sort: {
          _id: -1
        }, //this sorts the information bottom to top (-1)
        upsert: true //insett andupdate = upsert
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/thumbDown', (req, res) => {
    db.collection('messages')
      .findOneAndUpdate({
        name: req.body.name,
        msg: req.body.msg
      }, {
        $set: {
          thumbUp: req.body.thumbUp - 1
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/messages', (req, res) => {
    //deletemethod:Deletes a single document based on the filter and sort criteria, returning the deleted document https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndDelete/
    db.collection('messages').findOneAndDelete({
      name: req.body.name,
      msg: req.body.msg
    }, (err, result) => { //looks at messages collection,s finds and deletes.
      if (err) return res.send(500, err) //if error, send error
      res.send('Message deleted!')
    })
  })

  app.delete('/favorites', (req, res) => {
  console.log(req.body.id);
  // const deleteRoute = objectId(req.body.id)
  db.collection('favorites').findOneAndDelete({
    email: req.user.local.email,
    start: req.body.start,
    end: req.body.end
  },(err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

  //Authenticates the user and makes sure user is logged in and only on their account  =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
