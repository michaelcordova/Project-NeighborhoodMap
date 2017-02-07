/*
Project: Neighborhood Map
Developed by: Michael Cordova
For: Udacity
*/



var data = [
    {
        name: "Texas Spice",
        location: {lat: 32.7758770087906, lng: -96.8047791739758},
        type: 'restaurant',
    }, {
        name: "Texas de Brazil",
        location: {lat: 32.954765, lng: -96.830150},
        type: "restaurant",
    }, {
        name: "The Sixth Floor Museum",
        location: {lat: 32.7799763, lng: -96.8085353},
        type: "entertainment",
    }, {
        name: "NorthPark Center",
        location: {lat: 32.868952, lng: -96.773577},
        type: "shopping",
    }, {
        name: "Irving Mall",
        location: {lat: 32.839843, lng: -96.996469},
        type: "shopping",
    }
];


/*
* Create array for markers, create coordinates location when the map load,
* and function to initiate Google Map.
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

    infowindow = new google.maps.InfoWindow({ maxWidth: 400 });
    bounds = new google.maps.LatLngBounds();

    // Start knockout
    ko.applyBindings(new ViewModel());
}

// Function to clear markers.
var clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
       markers[i].setMap(null);
    }
};

// Yelp API
// Credit to https://arian.io/how-to-use-yelps-api-with-node/
var getYelp = function(marker) {
    newNonce = function() {
        return (Math.floor(Math.random() * 1e9).toString());
    };

    timestamp = function() {
        return Math.floor((new Date).getTime() / 1e3);
    };

    var httpMethod = 'GET',
    url = 'https://api.yelp.com/v2/search?',
    parameters = {
        oauth_consumer_key : 'pbgEiH-pMbycTGcDENnrTw',
        oauth_token : 'mGh9RGiZrOdMALoWyjLwzyxcccxYE1QH',
        oauth_nonce : newNonce(),
        oauth_timestamp : timestamp(),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0',
        term: marker.title,
        location: 'Dallas, TX',
        callback: 'cb',
        limit: 1
    },
    consumerSecret = 'fr3ZPEoHO2o404uW-byRoIhxw7I',
    tokenSecret = 'YGTSJNfAOSu7aRc2YUk90FsmsyU',
    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
    signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

    parameters.oauth_signature = signature;

    // Set up the ajax settings
    var ajaxSettings = {
        url: url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        success: function(response) {
            var yelpImage = response.businesses[0].image_url || 'No image provided',
                ratingImage = response.businesses[0].rating_img_url || 'No rating yet',
                comment = response.businesses[0].snippet_text || 'No comments provided';

            // Update the infoWindow to display the yelp rating image
            // $('#yelp-image').attr("src", yelpImage);
            // $('#yelp').attr("src", ratingImage);
            // $('#yelp-text').append(comment);


            infowindow.setContent('<div><h3>' + marker.title + '</h3></div>' +
                                  '<div id=img-place-holder>' +
                                    '<img id="yelp-image" src="'+ yelpImage +'"><br>' +
                                    '<img id="yelp-rating" src="'+ ratingImage +'"><br>' +
                                  '</div>' +
                                  '<div id="yelp-text-holder">' +
                                    '<p id="yelp-text">'+comment+'</p>' +
                                  '</div>');
        },
        error: function(response){
            infowindow.setContent('<div><h3>' + marker.title + '</h3></div>' +
                                  '<div>' +
                                    '<p id="yelp-text">Server is unresponsive.</p>' +
                                  '</div>');
        }
    };

    // Send off the ajax request to Yelp
    $.ajax(ajaxSettings);
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

        markers.push(self.marker);
    }, timeout);
};

var DataLocation = function(thisData) {
    var self = this;
    self.name = ko.observable(thisData.name);
    self.location = ko.observable(thisData.location);
    self.type = ko.observable(thisData.type);
    self.timeout = 1 * 450;

    window.setTimeout(function() {
        self.marker = new google.maps.Marker({
            position: self.location(),
            map: map,
            title: self.name(),
            icon: iconBaseColor,
            animation: google.maps.Animation.DROP
        });
        // Add listener event to open marker on click.
        self.marker.addListener('click', function() {
            self.populateTheInfoWindow = ko.observable(new populateInfoWindow(self.marker, infowindow));
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function() {
                self.marker.setAnimation(null);
            }, 1000);

        });
        // Change the color of marker when the mouse is over the pin
        self.marker.addListener('mouseover', function() {
            self.marker.setIcon(iconChangeColor);
        });
        // Change the color of marker back to original color when mouse is out.
        self.marker.addListener('mouseout', function() {
            self.marker.setIcon(iconBaseColor);
        });

        markers.push(self.marker);
    }, self.timeout);
};


/*
* Knockout JS
*/
var ViewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);
    self.filter = ko.observable('');

    // Add to the array the data that comes from server, in this case
    // the json structure typed above.
    data.forEach(function(locationItem) {
        self.locationList.push(new DataLocation(locationItem));
    });

    /*
    * Operators
    */

    // Function to clear all markers on call.
    self.clearAllMarkers = function() {
        clearMarkers();
    };

    // Function to load all markers again.
    self.loadAllMarkers = function() {
        for (var i = 0; i < markers.length; i++) {
            showMarker(markers[i]);
            // markers[i].setMap(map);
            markers[i].setAnimation(google.maps.Animation.DROP);
        }
    };

    // Function to populate InfoWindow when clicked one item from the list
    self.markerInfo = function(markerIn) {
        bounce(markerIn);
        populateInfoWindow(markerIn.marker, infowindow);
    };

    // Change marker color when mouse over one item from the list.
    self.enableMarkerColor = function(markerIn) {
        markerIn.marker.setIcon(iconChangeColor);
    };

    // Change marker color back when mouse out one item from the list.
    self.disableMarkerColor = function(markerIn) {
        markerIn.marker.setIcon(iconBaseColor);
    };

    // Filter locations
    self.locationFiltered = ko.computed(function() {
        self.query = ko.observable('');
        var filter = self.filter().toLowerCase();
        if (!filter) {
            for (var i = 0; i < markers.length; i++) {
                showMarker(markers[i]);
            }
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(item) {
                 value = item.name().toLowerCase().indexOf(filter) >= 0;
                 if (value) {
                     item.marker.setMap(map);
                     return item.name();
                 } else {
                     item.marker.setMap(null);
                 }
            });
        }
    },self.filter);
}.bind(this);


// This function create divs, call Yelp and put information on the infowindow.
function populateInfoWindow(marker, infowindow) {
    getYelp(marker);
    infowindow.open(map, marker);
}

function bounce(markerIn) {
    markerIn.marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {
        markerIn.marker.setAnimation(null);
    }, 1000);
}

function showMarker(marker){
    marker.setMap(map);
}

googleError = function(){
    alert("Upsss. Looks like Google Map can't connect to server");
};
