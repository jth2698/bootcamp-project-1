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

//function getLocation() {
//if (navigator.geolocation) {
//navigator.geolocation.getCurrentPosition(showPosition, function() {
//alert("You are welcome to use our search but we will not be able to show you local stores without your location.");
//});
//} else {
//alert("Geolocation is not supported by this browser. Please feel free to use our search.");
//}
//}

//function showPosition(position) {
//var lat = position.coords.latitude;
//var lon = position.coords.longitude;
//console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);
//}

//getLocation();
function getGeolocation() {
    navigator.geolocation.getCurrentPosition(drawMap);
}

function drawMap(geoPos) {
    geoLocate = new google.maps.LatLng(geoPos.coords.latitude, geoPos.coords.longitude);
    let mapProp = {
        center: geoLocate,
        zoom: 5,
    };
    let map = new google.maps.Map(document.getElementById("map"), mapProp);
    let infoWindow = new google.maps.InfoWindow({
        map: map,
        position: geoLocate,
        content: `Location from HTML5 Geolocation:
           <br>Latitude: ${geoPos.coords.latitude}
           <br>Longitude: ${geoPos.coords.longitude}`
    });
}
getGeolocation();

function error(err) {
    console.error(`ERROR(${error.code}): ${err.message}`);
}

function success(pos) {
    alert(`latitude: ${pos.coords.latitude}
    \n longitude: ${pos.coords.longitude}
    \n accuracy: ${pos.coords.accuracy}`);
}

function getGeolocation() {
    navigator.geolocation.getCurrentPosition(success, error);
}
