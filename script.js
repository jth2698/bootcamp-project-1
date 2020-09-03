const searchInput = $("#search-input");
const searchBtn = $("#search-button");

searchBtn.on("click", function() {

    const query = searchInput.val();

    console.log(query);

    var BBApiKey = "GGmupVaRMy1eDvoIlNss1A0G";

    var BBUrl = "https://api.bestbuy.com/v1/products?format=json&show=all&apiKey=" + BBApiKey;

    $.ajax({
        url: BBUrl,
        method: "GET",

    }).then(function(response) {

        console.log(response);

        const resultsLeft = $("#results-left");

        const productArray = response.products;

        for (i = 0; i < productArray.length; i++) {
            productName = response.products[i].name;
            if (productName.includes(query)) {
                const resultDiv = $("<div></div>");
                resultDiv.text(productName + "-" + productName.regularPrice);
                resultsLeft.append(resultDiv);
            }
        }
    })
})

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.2672, lng: -97.7431 },
        zoom: 13
    });
    infoWindow = new google.maps.InfoWindow;

    $.get("https://ipinfo.io?token=d92f854e302724", function(response) {
        console.log(response.ip, response.country);
        var coordinates = response.loc.split(",");
        console.log(coordinates);
        var pos = {
            lat: parseFloat(coordinates[0]),
            lng: parseFloat(coordinates[1])
        };
        console.log(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Lets find some Best Buys');
        infoWindow.open(map);
        map.setCenter(pos);
    }, "jsonp");

    console.log(google.maps);


    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         var pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //         };

    //         infoWindow.setPosition(pos);
    //         infoWindow.setContent('Lets find some Best Buys');
    //         infoWindow.open(map);
    //         map.setCenter(pos);
    //     }, function() {
    //         handleLocationError(true, infoWindow, map.getCenter());
    //     });
    // } else {

    //     handleLocationError(false, infoWindow, map.getCenter());
    // }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}