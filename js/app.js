
// Model
var locations = [
        {
            title: 'Lincoln Center',
            position: {
                lat: 40.7725,
                lng: -73.9835
            },
            marker: null
        },
        {
            title: 'MOMA',
            position: {
                lat: 40.7614,
                lng: -73.9776
            },
            marker: null
        },
        {
            title: 'Whitney Museum',
            position: {
                lat: 40.7396,
                lng: -74.0089
            },
            marker: null
        },
        {
            title: 'Carnegie Hall',
            position: {
                lat: 40.7651,
                lng: -73.9799
            },
            marker: null
        },
        {
            title: 'Met Museum',
            position: {
                lat: 40.7794,
                lng: -73.9632
            },
            marker: null
        }
];

var map;

// View Model

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: locations[3].position
    });

    ko.applyBindings(new ViewModel());
}

var ViewModel = function() {
    var self = this;

    this.allLocations = ko.observableArray(locations);
    this.filteredLocations = ko.observableArray(locations);

    this.setCenter = function(location) {
        map.setCenter(location.position);
        location.marker.setAnimation(google.maps.Animation.DROP);

    }
    this.allLocations().forEach(function(location) {
        var marker = new google.maps.Marker({
            map: map,
            position: location.position,
            title: location.title,
            animation: google.maps.Animation.DROP
        });
        location.marker = marker;
    });



    this.filter = ko.observable('');

    this.filterLocations = function () {
        self.filteredLocations.removeAll();

        self.allLocations().forEach(function (location) {
            location.marker.setVisible(false);
            var filterItem = self.filter().toLowerCase();
            var locationName = location.title.toLowerCase();

            if (locationName.indexOf(filterItem) >= 0) {
                self.filteredLocations.push(location);
                location.marker.setVisible(true);
                location.marker.setAnimation(google.maps.Animation.DROP);
            }
        });
    }
}
