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
    init: function (location) {
        console.log("map.init() called");
        // map properties
        var mapProp = {
            center: location,
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // initialise map   
        map = new google.maps.Map(document.getElementById("map"), mapProp);

        // initialise marker
        var marker = new google.maps.Marker({
            position: location,
            animation: google.maps.Animation.BOUNCE
        });

        // add marker to map
        marker.setMap(map);

        // initialise infowindow
        var infowindow = new google.maps.InfoWindow({
            content: "My Approximate Current Position",
        });

        // open map      
        infowindow.open(map, marker);
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
        map.init(location);
        console.log("Position", location);
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