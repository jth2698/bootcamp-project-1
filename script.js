const spendCap = 1000;
const spendLow = spendCap - (spendCap * .5);

const postalCode = "78751";

const searchInput = $("#search-input");
const searchBtn = $("#search-button");

const resultsContainer = $("#results-container");

const allMatchingProducts = [];

let baseURL = "https://api.bestbuy.com/v1/products";

let BBAPIKey = "&apiKey=GGmupVaRMy1eDvoIlNss1A0G";

function returnProducts() {

    let query = searchInput.val();
    query = query.toString();
    query = query.trim();

    let queryURL = "((search=" + query + ")";

    let activeProducts = "&sku=*";

    let inStoreURL = "&inStoreAvailability=true)?";

    let pageSize = "pageSize=100"

    let cursorMark = "&cursorMark=*"

    let format = "&format=json";

    let productURL = baseURL + queryURL + activeProducts + inStoreURL + pageSize + cursorMark + BBAPIKey + format;

    let allMatchingProductsI = 0;

    console.log(productURL);

    $.ajax({
        url: productURL,
        method: "GET",

    }).then(function (productResponse) {

        console.log(productURL);

        let allReturnedProducts = productResponse.products;

        for (i = 0; i < allReturnedProducts.length - 1; i++) {

            console.log("pushing into allMatchingProducts")

            let productName = allReturnedProducts[i].name;
            let productImageSrc = allReturnedProducts[i].thumbnailImage;
            let productSKU = allReturnedProducts[i].sku;
            let productPrice = allReturnedProducts[i].salePrice;

            if (productPrice > spendLow && productPrice < spendCap) {

                allMatchingProducts[allMatchingProductsI] = { "name": productName, "imageSource": productImageSrc, "sku": productSKU, "price": productPrice, "storeURL": baseURL + "/" + productSKU + "/stores.json?postalCode=" + postalCode + BBAPIKey, "stores": [] };

                allMatchingProductsI++;
            }
        }

        sortProducts();
    })
}

async function populateStores() {

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

        console.log("populateStores running");

        let skuInsert = "/" + allMatchingProducts[i].sku + "/stores.json?";

        let postalCodeInsert = "postalCode=" + postalCode;

        let storeURL = baseURL + skuInsert + postalCodeInsert + BBAPIKey;

        var storeResponse = await $.ajax({
            url: storeURL,
            method: "GET",

        })

        for (x = 0; x < storeResponse.stores.length - 1; x++) {

            console.log(storeURL);

            allMatchingProducts[i].stores.push(JSON.stringify(storeResponse.stores[x].name));

            console.log(allMatchingProducts);
        }

    }
    populateResults();

}

function sortProducts() {

    allMatchingProducts.sort((a, b) => {

        return a.price - b.price;
    });

    console.log(allMatchingProducts);

    populateStores();

}

function populateResults() {

    setTimeout(function () {

        console.log("populateResults running");

        console.log(allMatchingProducts);

        for (i = 0; i < allMatchingProducts.length - 1; i++) {

            console.log("content loop running" + i);

            productDiv = $("<div></div>");

            namePara = $("<p></p>");
            namePara.text(allMatchingProducts[i].name);

            pricePara = $("<p></p>").text(allMatchingProducts[i].price);

            productDiv.append(namePara, pricePara);

            productImage = $("<img></img>");
            productImage.attr("src", allMatchingProducts[i].imageSource);
            productDiv.append(productImage);

            storeDiv = $("<div></div>");

            storeHeader = $("<h4></h4>")
            storeHeader.text("Available at:");
            storeDiv.append(storeHeader);

            storePara = $("<p></p>");
            console.log("writing " + allMatchingProducts[i].stores);
            storePara.text(allMatchingProducts[i].stores);
            storeDiv.append(storePara);

            productDiv.append(storeDiv);

            resultsContainer.append(productDiv);

        }
    }, 5000);

}

searchBtn.on("click", function () {

    resultsContainer.empty();

    returnProducts();
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
