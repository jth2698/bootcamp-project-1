// target the two inputs and search button
const spendInput = $("#spend-input");
const searchInput = $("#search-input");
const searchBtn = $("#search-button");

// target the results container
const resultsContainer = $("#results-container");

// globally define postal code, spend range, base BB URL, and the BB API key, and create an empty array to hold the object to be created from the BB API return
// note that the zip is hard-coded until we can figure out how to pass zip from the BB API

let postalCode = "78751";

let spendCap = "";

let spendLow = "";

let baseURL = "https://api.bestbuy.com/v1/products";

let BBAPIKey = "&apiKey=GGmupVaRMy1eDvoIlNss1A0G";

let allMatchingProducts = [];

// spendRange function creates the spend range from the max spend input provided by user

function spendRange() {

    spendCap = spendInput.val();

    console.log(spendCap);

    spendLow = spendCap - (spendCap * .5);

    console.log(spendLow.toString());
}

// returnProducts returns all matching products in response to user search input. this function pushes the needed key-value pairs into the allMatchingProducts array. however, note that this does not return local stores.

function returnProducts() {

    let query = searchInput.val();
    query = query.toString();
    query = query.trim();
    query = query.replace(" ", "&search=");
    console.log(query);

    let queryURL = "((search=" + query + ")";

    let priceFloor = "&salePrice>=" + spendLow.toString();

    let activeProducts = "&sku=*";

    let inStoreURL = "&inStoreAvailability=true)?";

    let pageSize = "pageSize=100"

    let cursorMark = "&cursorMark=*"

    let format = "&format=json";

    let productURL = baseURL + queryURL + priceFloor + activeProducts + inStoreURL + pageSize + cursorMark + BBAPIKey + format;

    let allMatchingProductsI = 0;

    console.log(productURL);

    let maxPages = 5;
    let maxPageI = 1;

    $.ajax({

        // using this app as a quick fix to avoid CORS errors
        url: "https://cors-anywhere.herokuapp.com/" + productURL,
        method: "GET",

    })

        .then(function (productResponse) {

            let allReturnedProducts = productResponse.products;

            for (i = 0; i < allReturnedProducts.length - 1; i++) {

                let productName = allReturnedProducts[i].name;
                let productImageSrc = allReturnedProducts[i].thumbnailImage;
                let productSKU = allReturnedProducts[i].sku;
                let productPrice = allReturnedProducts[i].salePrice;
                // this remains as an empty array even after this function runs
                let productStores = [];
                let productStoreAddresses = [];
                let productURL = allReturnedProducts[i].url;

                if (productPrice > spendLow && productPrice < spendCap) {

                    console.log("pushing into allMatchingProducts");

                    allMatchingProducts[allMatchingProductsI] = { "name": productName, "imageSource": productImageSrc, "sku": productSKU, "price": productPrice, "stores": productStores, "storeAddresses": productStoreAddresses, "url": productURL };

                    allMatchingProductsI++;

                    console.log(allMatchingProducts);
                }

            }

            // sortProducts always run as soon as BB product results are pushed into allMatchingProducts. see sortProducts description below populateStores.
            sortProducts();

        })
}



// populateStores pushes the store information into allMatchingProducts. note that this needs to be set up as an "async" function that waits for the result of the promise from the ajax call before. otherwise, the first loop will run before the promise reflected by the ajax call returns (meaning all stores will be pushed into the last allMatchingProducts object)

async function populateStores() {

    console.log("populateStores running");

    // we slice the allMatchingProducts array to the first 10 entries to avoid hammering the BB API. These will be the 10 cheapest within the spend range

    allMatchingProducts = allMatchingProducts.slice(0, 9);

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

        console.log("populateStores running");

        let skuInsert = "/" + allMatchingProducts[i].sku + "/stores.json?";

        let postalCodeInsert = "postalCode=" + postalCode;

        let storeURL = baseURL + skuInsert + postalCodeInsert + BBAPIKey;

        var storeResponse = await $.ajax({

            // using this app as a quick fix to avoid CORS errors
            url: "https://cors-anywhere.herokuapp.com/" + storeURL,
            method: "GET",

        })

        for (x = 0; x < storeResponse.stores.length - 1 && x < 5; x++) {

            console.log(storeURL);

            console.log("pushing stores into allMatchingProducts " + i);
            allMatchingProducts[i].stores.push(JSON.stringify(storeResponse.stores[x].name));
            allMatchingProducts[i].storeAddresses.push(JSON.stringify(storeResponse.stores[x].address));

            console.log(allMatchingProducts);
        }


    }

    // do not want populateResults to run until all stores have been populated
    populateResults();

    populateStoreMarkers();
}


// sortProducts actually runs before populateStores. it sorts all products in the original return to allMatchingProducts form price-low to price-high.

function sortProducts() {

    console.log(allMatchingProducts);

    console.log("sorting");

    allMatchingProducts.sort((a, b) => {

        return a.price - b.price;
    });

    console.log(allMatchingProducts);

    // note that populateStores is only called after sorting is finished.
    populateStores();

}

// populateResults creates the results on the page after opoulateStores has run. note that it is wrapped in a setTimeout to ensure that it does not run until after populateStores has completed. this is potentially a temporary fix to avoid creating empty results before populate stores has run.

function populateResults() {

    console.log("populateResults running");

    console.log(allMatchingProducts);

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

        console.log("content loop running" + i);

        let productDiv = $("<div></div>");

        let namePara = $("<p></p>").text(allMatchingProducts[i].name);

        let pricePara = $("<p></p>").text(allMatchingProducts[i].price);

        productDiv.append(namePara, pricePara);

        let productImage = $("<img></img>").attr("src", allMatchingProducts[i].imageSource);
        productDiv.append(productImage);

        let storeDiv = $("<div></div>");

        if (allMatchingProducts[i].stores && allMatchingProducts[i].stores.length) {

            let storeHeader = $("<h4></h4>").text("Available at:");
            storeDiv.append(storeHeader);

            let storeLi = $("<li></li>");
            console.log("writing " + allMatchingProducts[i].stores);

            for (x = 0; x < allMatchingProducts[i].stores.length - 1; x++) {

                let store = allMatchingProducts[i].stores[x];
                store.replace("\"", "");
                let storeUl = $("<ul></ul>").text(store);
                storeLi.append(storeUl);
            }

            storeDiv.append(storeLi);

            // want to write the BB product URL to the page if there are no local stores. allows the user to order online if they cannot get locally.
        } else {

            let storeHeader = $("<h4></h4>").text("Not available locally!");
            storeDiv.append(storeHeader);

            let storePara = $("<p>Try online at " + allMatchingProducts[i].url + "</p>");
            storeDiv.append(storePara);
        }

        productDiv.append(storeDiv);

        resultsContainer.append(productDiv);
    }
}

// the on.click order. returnProducts calls sortProducts and sortProducts calls populateStores, so sortProducts and populateStores do not need to be seperately called. 

searchBtn.on("click", function () {

    resultsContainer.empty();

    spendRange();

    returnProducts();
})



var map, infoWindow, geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.2672, lng: -97.7431 },
        zoom: 10
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

function populateStoreMarkers() {

    console.log("populateStoreMarkers running");

    geocoder = new google.maps.Geocoder();

    var marker, i;

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

        if (allMatchingProducts[i].stores && allMatchingProducts[i].stores.length) {

            for (x = 0; x < allMatchingProducts[i].storeAddresses.length - 1; x++) {

                var address = allMatchingProducts[i].storeAddresses[x];
                console.log(address);

                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == 'OK') {
                        map.setCenter(results[0].geometry.location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }
        }
    }
}
