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


var map;
var bounds;
var infowindow;
var markers = [];

var dallasTexas = {lat: 32.775937, lng: -96.804616};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: dallasTexas


    });

    infowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    // Start knockout
    ko.applyBindings(new ViewModel());
}


// Create Markers
var createMarkers = function() {
    var self = this;
    clearMarkers();

    for (var i = 0; i < data.length; i++) {
        self.name = data[i].name;
        self.position = data[i].location;
        self.timeout = i * 450;
        self.addingMarkers = ko.observable(new addMarkers(self.position, self.name, self.timeout));
        console.log (i);
    }
};

// Function to clear markers.
var clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
};




// Icons Colors.
var iconBaseColor = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var iconChangeColor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

// Function to add created markers to the array.
var addMarkers = function(location, title, timeout) {
    var self = this;
    // Drop marker with some delay between them.
    window.setTimeout(function() {
        self.marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            icon: iconBaseColor,
            animation: google.maps.Animation.DROP
        });
        // Add listener event to open marker on click.
        self.marker.addListener('click', function() {
            self.populateTheInfoWindow = ko.observable(new populateInfoWindow(self.marker, infowindow));
        });
        // Change the color of marker when the mouse is over the pin
        self.marker.addListener('mouseover', function() {
            self.marker.setIcon(iconChangeColor);
        });
        // Change the color of marker back to original color when mouse is out.
        self.marker.addListener('mouseout', function() {
            self.marker.setIcon(iconBaseColor);
        });

        // ko.utils.arrayPushAll(self.markers, self.marker);
        markers.push(self.marker);


    }, timeout);


};

var dataLocation = function(thisData) {
    var self = this;
    self.name = ko.observable(thisData.name);
    self.location = ko.observable(thisData.location);
    self.type = ko.observable(thisData.type);
};


/*
Knockout JS
*/
var ViewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);

    data.forEach(function(locationItem) {
        self.locationList.push(new dataLocation(locationItem));
    });

    self.createMarker = ko.observable(new createMarkers());

    /*
    Operators
    */

    // Function to clear all markers on call.
    self.clearAllMarkers = function() {
        clearMarkers();
    };

    self.loadAllMarkers = function() {
        createMarkers();
    };



}.bind(this);




// This function put information on the infowindow.
function populateInfoWindow(marker, infowindow) {
    infowindow.setContent('<div><h3>' + marker.title + '</h3></div>');
    infowindow.open(map, marker);
}
