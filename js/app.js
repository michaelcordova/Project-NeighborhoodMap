//* Udacity Project Neighborhood Map *//

var data = {
        restaurants: [
            {
                name: "Texas Spice",
                location: {lat: 32.775937, lng: -96.804616},
                type: 'restaurant'
            },{
                name: "Kenny's Wood Fired Grill",
                location: {lat: 32.95544, lng: -96.835321},
                type: "restaurant"
            }
        ],

        entertainment: [
            {
                name: "The Sixth Floor Museum",
                location: {lat: 32.7799763, lng: -96.8085353},
                type: "entertainment"
            }
        ],

        shopping: [
            {
                name: "NorthPark Center",
                location: {lat: 32.796318, lng: -97.0297781},
                type: "shopping"
            },{
                name: "Southwest Center Mall",
                location: {lat: 32.8459027, lng: -97.0369607},
                type: "shopping"
            }
        ]
    };


var map;
// Create a new blank array for markers.
var markers = [];

// Coordinates for the googlemap.
var dallasTexas = {lat: 32.897480, lng: -97.040443};

// Initiate google map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: dallasTexas
        });

    var largeInfoWindow = new google.maps.InfoWindow();

    // Use google icons for each category
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        restaurant: {
            image: {
                url: iconBase + 'dining.png',
                scaledSize: new google.maps.Size(32, 32), // scaled size
                // origin: new google.maps.Point(0,0), // origin
                // anchor: new google.maps.Point(0,0) // anchor
            }
        },
        entertainment: {
            image: {
                url: iconBase + 'flag.png',
                scaledSize: new google.maps.Size(32, 32), // scaled size
            }
        },
        shopping: {
            image: {
                url: iconBase + 'shopping.png',
                scaledSize: new google.maps.Size(32, 32), // scaled size
            }
        }
    };

    // Loop to create markers from the variable data.
    for (var key in data){
        // Array for key in data
        var dataCategory = data[key];
        for (var i = 0; i < dataCategory.length; i++){
            position = dataCategory[i].location;
            var title = dataCategory[i].name;
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                icon: icons[dataCategory[i].type].image,
                animation: google.maps.Animation.DROP,
                id: i,
            });
            markers.push(marker);
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfoWindow);
            });
        }
    }
}

// This function load all markers to the map
function showLocations() {
    hideMarkers(markers);
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function show the marker for the picked placed.
function showPickedPlace() {
    hideMarkers(markers);


}

// This function put information on the infowindow.
function populateInfoWindow(marker, infowindow) {
    infowindow.setContent('<div><h3>' + marker.title + '</h3></div>');
    infowindow.open(map, marker);
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
}

//**** Knockout JS ****//
var ViewModel = function() {
    // Create variables with observables
    this.categoryList = ko.observableArray([]);
    this.choosenCategory = ko.observable();
    this.placesList = ko.observableArray([]);
    this.choosenPlace = ko.observable();
    this.places = ko.observable();

    // Loop through categories in data to get the name of the places
    for (var categories in data) {
        if (data.hasOwnProperty(categories)) {
            this.categoryList.push({name:  categories });
            categoryName = data[categories];
            for (var places in categoryName) {
                if (categoryName.hasOwnProperty(places)) {
                    this.placesList.push({name: categoryName[places].name});
                }
            }
        }
    }
}.bind(this);


ko.applyBindings(new ViewModel());

document.getElementById('place-picker').addEventListener('click', function() {
    showPickedPlace();
});
