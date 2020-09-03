const searchInput = $("#search-input");
const searchBtn = $("#search-button");

searchBtn.on("click", function () {

    const baseURL = "https://api.bestbuy.com/v1/";

    let searchType = "products";

    let query = searchInput.val();
    query = query.toString();
    query = query.trim();

    console.log(query);

    let queryURL = "((search=" + query + ")";

    let activeProducts = "&sku=*";

    let inStoreURL = "&inStoreAvailability=true)?";

    let pageSize = "pageSize=100"

    let cursorMark = "&cursorMark=*"

    let JSONFormat = "&format=json";

    let BBAPIKey = "&apiKey=GGmupVaRMy1eDvoIlNss1A0G";

    productURL = baseURL + searchType + queryURL + activeProducts + inStoreURL + pageSize + cursorMark + BBAPIKey + JSONFormat;

    console.log(productURL);

    $.ajax({
        url: productURL,
        method: "GET",

    }).then(function (response) {

        console.log(productURL);

        let allProducts = response.products;

        let allProductSKUs = [];

        for (i = 0; i < allProducts.length; i++) {

            let productSKU = allProducts[i].sku;
            allProductSKUs.push(productSKU);
        }

        console.log(allProductSKUs);
    })
})

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.2672, lng: -97.7431 },
        zoom: 13
    });
    infoWindow = new google.maps.InfoWindow;

    $.get("https://ipinfo.io?token=d92f854e302724", function (response) {
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

function getGeolocation() {
    navigator.geolocation.getCurrentPosition(success, error);
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
