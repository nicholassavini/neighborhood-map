
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

var nyTimesArticles = function(location) {
    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyturl += '?' + $.param({
      'api-key': "44aad7b8bb1043c494f83b4ecc6509ab",
      'q': '"' + location.title + '"'
    });
    var $content = $("<ul></ul>");
    $.getJSON(nyturl, function(data) {
        //$nytHeaderElem.text('New York Times Articles About ' + city);

        var articles = data.response.docs;
        $.each(articles, function(key) {
            var article = articles[key];
            $content.append('<li class="article">' + '<a href="'
                            + article.web_url + '">' + article.headline.main
                            + '</a>' + '</p>' + '</li>');

        });
    }).fail($content.text('New York Times Articles Not Found'));
    //console.log($content);
    return $content;
}
var ViewModel = function() {
    var self = this;

    // create inital arrays to hold all locations
    this.allLocations = ko.observableArray(locations);

    // create array that will hold filtered locations
    this.filteredLocations = ko.observableArray();
    this.allLocations().forEach(function(location) {
        self.filteredLocations.push(location);
    });

    // Creates the info window object
    var infoWindow = new google.maps.InfoWindow();

    // Sets the marker to bounce for a period of time

    this.bounceMarker = function(location) {
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
            location.marker.setAnimation(null);
        }, 1440);
    }

    // generates markers for the map
    this.allLocations().forEach(function(location) {
        var marker = new google.maps.Marker({
            map: map,
            position: location.position,
            title: location.title,
            animation: google.maps.Animation.DROP
        });

        // opens an info window when a marker is clicked
        marker.addListener('click', function() {
            self.bounceMarker(location);
            infoWindow.setContent(nyTimesArticles(location));
            infoWindow.open(map, marker);
        });

        location.marker = marker;
    });

    // resets the center of the maps when a location is clicked
    this.setCenter = function(location) {
        map.setCenter(location.position);
        self.bounceMarker(location);
    }

    // the text entered into the search filter
    this.filter = ko.observable('');

    // filters out locations that don't meet the search criteria
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
