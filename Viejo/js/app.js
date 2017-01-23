/*
Project: Neighborhood Map
Developed by: Michael Cordova
For: Udacity
*/

var data = {
        restaurants: [
            {
                name: "Texas Spice",
                location: {lat: 32.775834, lng: -96.804820},
                type: 'restaurant'
            },{
                name: "Texas de Brazil",
                location: {lat: 32.954765, lng: -96.830150},
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
                location: {lat: 32.868952, lng: -96.773577},
                type: "shopping"
            },{
                name: "Irving Mall",
                location: {lat: 32.839843, lng: -96.996469},
                type: "shopping"
            }
        ]
    };

/*
Create array for markers, create coordinates location for when the map load,
and function to initiate Google Map.
*/
var markers = [];
var map;

var dallasTexas = {lat: 32.897480, lng: -97.040443};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: dallasTexas
        });

    // Start knockout
    ko.applyBindings(new ViewModel());
}



/*
Knockout JS
*/
var ViewModel = function() {
    var self = this;

    // Create variables with observables
    self.categoryList = ko.observableArray([]);
    self.choosenCategory = ko.observable();
    self.placesList = ko.observableArray([]);
    self.chosenPlace = ko.observable();

    // Place picker function to clear all markers and set map center and zoom in.
    self.chosenPlaceMarker = function(viewModel, event) {
        hideMarkers(self.markers);
        markers[self.chosenPlace().id].setMap(map);
        map.setCenter(self.chosenPlace().center);
        map.setZoom(17);
    };

    var largeInfoWindow = new google.maps.InfoWindow();

    // Use google icons for each category
    var iconBaseColor = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    var iconChangeColor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

    // ID Counter for markers
    var ids = -1;
    idCounter = function () {
        ids += 1;
        return ids;
    };

    // Loop through categories in data to get the categories and name of the places
    for (var categories in data) {
        if (data.hasOwnProperty(categories)) {
            self.categoryList.push({ name:  categories });
            categoryName = data[categories];

            for (var places in categoryName) {
                if (categoryName.hasOwnProperty(places)) {

                    // Data for markers creation
                    self.position = categoryName[places].location;
                    self.title = categoryName[places].name;
                    self.id = idCounter();
                    self.marker = new google.maps.Marker({
                        position: self.position,
                        title: self.title,
                        icon: iconBaseColor,
                        animation: google.maps.Animation.DROP,
                        id: self.id
                    });
                    self.marker.addListener('click', function() {
                        populateInfoWindow(this, largeInfoWindow);
                    });


                    markers.push(self.marker);

                    self.placesList.push({
                        name: categoryName[places].name,
                        id: self.id,
                        center: self.position
                    });

                }
            }
        }
    }


    /*
    Create function to load all markers to the map
    */
    showLocations = function() {
        hideMarkers(self.markers);
        var bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    };

    hideMarkers = function() {
        for (var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
    };

}.bind(this);




// This function show the marker for the picked placed.
function showPickedPlace() {
    hideMarkers(self.markers);
}

// This function put information on the infowindow.
function populateInfoWindow(marker, infowindow) {
    infowindow.setContent('<div><h3>' + marker.title + '</h3></div>');
    infowindow.open(map, marker);
}
