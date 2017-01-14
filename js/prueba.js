var data = {
        restaurants: [
            {
                name: "Texas Spice",
                location: {lat: 32.775937, lng: -96.804616},
                type: "restaurant"
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



var ViewModel = function() {
    this.categoryList = ko.observableArray([]);
    this.choosenCategory = ko.observable();
    for (var category in data) {
        if (data.hasOwnProperty(category)) {
            this.categoryList.push({name:  category });
        }
    }

    this.placesList = ko.observableArray([]);
    this.choosenPlace = ko.observable();
    this.places = ko.observable();
    for (var categories in data) {
        if (data.hasOwnProperty(category)) {
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
