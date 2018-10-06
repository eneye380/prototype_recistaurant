console.log('executing');
let model = {

};

let view = {
    initMap: function () {
        map.ifSupports();
        //alert("apple");
    }
};

let octopus = {

};

let map = {
    map: null,
    selectedLocation: null,
    init: function (location) {
        console.log("map.init() called");
        // map properties
        var mapProp = {
            center: location,
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // initialise map   
        this.map = new google.maps.Map(document.getElementById("map"), mapProp);

        // initialise marker
        var marker = new google.maps.Marker({
            position: location,
            animation: google.maps.Animation.BOUNCE
        });

        // add marker to map
        marker.setMap(this.map);

        // initialise infowindow
        var infowindow = new google.maps.InfoWindow({
            content: "My Approximate Current Position",
        });

        // open map      
        infowindow.open(this.map, marker);
        this.autocomplete(this.map);
    },
    initRestaurants: function (location, key = 'dinner', min = 0, max = 5) {
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 4
        });
        console.log("initRestaurants::map",this.map);
        console.log("initRestaurants::location",location);

        bounds = new google.maps.LatLngBounds();
        bounds.extend(location);
        this.map.fitBounds(bounds);

        var request = {
            location: location,
            radius: '10000',
            keyword: key,
            minPriceLevel: min,
            maxPriceLevel: max,
            types: ['restaurant']
            //types: ['restaurant', 'cafe', 'meal_delivery', 'meal_takeaway', 'asian', 'food', 'drink']

        };
        //
        var marker = new google.maps.Marker({
            position: location,
            animation: google.maps.Animation.BOUNCE,
            title: "My Approximate Current Position"
        });
        // 
        marker.setMap(this.map);
        //
        var infowindow = new google.maps.InfoWindow({
            content: "My Approximate Current Position",
        });
        infowindow.open(this.map, marker);
        service = new google.maps.places.PlacesService(this.map); //service:PlacesService
        service.nearbySearch(request, this.callback);
        this.autocomplete(this.map);
    },
    ifSupports: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.position, this.showError);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    },
    position: function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let location = new google.maps.LatLng(lat, lon);
        map.initRestaurants(location);
        console.log("Position", location);
    },
    autocomplete: function (map) {
        var input = /** @type {HTMLInputElement} */ (
            document.getElementById('locationpara'));

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
        var m = this;
        google.maps.event.addListener(autocomplete, 'place_changed', function () {

            var place = autocomplete.getPlace();

            selectedLocation = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            m.initRestaurants(selectedLocation);
        });

    },
    callback: function (results, status) {
        console.log("callback::result",results);
        console.log("callback::status",status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                map.getResultDetails(results[i]);
            }
        }
    },
    getResultDetails: function (result) {
        console.log("getResultDetails::result",result);
        var placeLoc = result.geometry.location; //lat lng coordinates
        bounds.extend(placeLoc);
        console.log("getResultDetails::map",this.map);
        this.map.fitBounds(bounds);
        //a place details request variable
        var request = {
            placeId: result.place_id
        };
        //
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(this.map); //service:PlacesService
        //a PlaceService method to Retrieves details about the Place identified by the given placeId
        var name;
        var m = this;
        service.getDetails(request, function (place, status) {
            console.log("service.getDetails::place",place);
            console.log("service.getDetails::status",status);
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var marker = new google.maps.Marker({
                    map: m.map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent("<b>Name:</b> " + place.name + "<br><b>Address:</b> " + place.formatted_address + "<br> <b>Phone Number: </b>" + place.formatted_phone_number + "<br> <b>Price Level:</b> " + place.price_level);
                    infowindow.open(this.map, this);
                    plc_id = result.place_id;
                    name = place.name;
                    document.getElementById('restaurant_name').innerHTML = place.name;
                    document.getElementById('restaurant_name_1').value = name;
                    document.getElementById('placeid').value = plc_id;
                    document.getElementById("hint").innerHTML = "enter review here";
                    showReview(plc_id);
                    showRating(plc_id);
                    $('span.stars').stars();
                });
            }
        });
    },
    showError: function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                //alert("m5a");
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                //alert("m5b");
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                //alert("m5c");
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                //alert("m5d");
                console.log("An unknown error occurred.");
                break;
        }
    }
}

function initMap() {
    // Add your map here.
    console.log('Google Maps API version: ' + google.maps.version);
    view.initMap();
}