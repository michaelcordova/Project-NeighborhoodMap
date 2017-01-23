/*
Project: Neighborhood Map
Developed by: Michael Cordova
For: Udacity
*/

var data = [
    {
        name: "Texas Spice",
        location: {lat: 32.775834, lng: -96.804820},
        type: 'restaurant',
        visible: true
    }, {
        name: "Texas de Brazil",
        location: {lat: 32.954765, lng: -96.830150},
        type: "restaurant",
        visible: true
    }, {
        name: "The Sixth Floor Museum",
        location: {lat: 32.7799763, lng: -96.8085353},
        type: "entertainment",
        visible: true
    }, {
        name: "NorthPark Center",
        location: {lat: 32.868952, lng: -96.773577},
        type: "shopping",
        visible: true
    }, {
        name: "Irving Mall",
        location: {lat: 32.839843, lng: -96.996469},
        type: "shopping",
        visible: true
    }
];

/*
Create array for markers, create coordinates location for when the map load,
and function to initiate Google Map.
*/

var markers = [];
var map;
var bounds;
var infowindow;
var dallasTexas = {lat: 32.775937, lng: -96.804616};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: dallasTexas
    });

    infowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    // Start knockout
    createMarkers();

    ko.applyBindings(new ViewModel());
}

// Icons Colors.  Call only once when the javascript load.
var iconBaseColor = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var iconChangeColor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

var addMarkers = function(location, title, timeout) {
    // Drop marker with some delay between them.
    window.setTimeout(function() {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            icon: iconBaseColor,
            animation: google.maps.Animation.DROP
        });
        // Add listener event to open marker on click.
        marker.addListener('click', function() {
            populateInfoWindow(marker, infowindow);
        });
        // Change the color of marker when the mouse is over the pin
        marker.addListener('mouseover', function() {
            marker.setIcon(iconChangeColor);
        });
        // Change the color of marker back to original color when mouse is out.
        marker.addListener('mouseout', function() {
            marker.setIcon(iconBaseColor);
        });
        markers.push(marker);


    }, timeout);

};



var createMarkers = function() {
    clearMarkers();

    for (var i = 0; i < data.length; i++) {
        name = data[i].name;
        position = data[i].location;
        timeout = i * 450;
        addMarkers(position, name, timeout);
    }
};

var clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
};



/*
Knockout JS
*/
var ViewModel = function() {
    var self = this;
    var prueba = ["today"];


}.bind(this);




// This function put information on the infowindow.
function populateInfoWindow(marker, infowindow) {
    infowindow.setContent('<div><h3>' + marker.title + '</h3></div>');
    infowindow.open(map, marker);
}
