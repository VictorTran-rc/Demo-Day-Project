const getClosestStationButton = document.querySelector('#getClosestStation')
getClosestStationButton.addEventListener('click', getClosestStation);
document.querySelector('#end').addEventListener('keyup', event => {
  if(event.key === 'Enter') {
    getClosestStation();
  }
})
document.querySelector('#start').addEventListener('keyup', event => {
  if(event.key === 'Enter') {
    getClosestStation();
  }
})

const getCurrentLocationBtn = document.querySelector('#getCurrentLocation')
let currentLocationInput = document.querySelector('#start')
getCurrentLocationBtn.addEventListener('click', getLocation)
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    currentLocationInput.value = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  currentLocationInput.value = position.coords.latitude + ", " + position.coords.longitude;
}

function getClosestStation() {
  console.log("Thank You Anthony");
  let startPosition = document.querySelector('#start').value
  let endPostion = document.querySelector('#end').value

  startPosition = startPosition.split(' ').join('+')
  endPostion = endPostion.split(' ').join('+');

  let getAddress = `https://www.google.com/maps/embed/v1/directions?key={googlemapsAPIKEY}&origin=${startPosition}&destination=${endPostion}&mode=transit`

  document.getElementById('tripPlanner').src = getAddress
}

//var map
var infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
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
  infoWindow.open(map);
}
