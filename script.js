// target the two inputs and search button
const spendInput = $("#spend-input");
const searchInput = $("#search-input");
const searchBtn = $("#search-button");

// shhh. easter egg. don't tell.
const spyKidsButton = $("#spy-kids");

// target the results section and results-show container
const resultsSection = $("#results");
const loadingDiv = $("#loading");
const resultsShow = $("#results-show");

// globally define postal code, spend range, base BB URL, and the BB API key, and create an empty array to hold the object to be created from the BB API return

let postalCode = "";

let spendCap = "";

let spendLow = "";

let baseURL = "https://api.bestbuy.com/v1/products";

let BBAPIKey = "&apiKey=GGmupVaRMy1eDvoIlNss1A0G";

let allMatchingProducts = [];

// spendRange function creates the spend range from the max spend input provided by user

function spendRange() {

    spendCap = spendInput.val();

    spendLow = spendCap - (spendCap * .25);
}

// returnProducts returns all matching products in response to user search input. this function pushes the needed key-value pairs into the allMatchingProducts array. however, note that this does not return local stores.

function returnProducts() {

    let query = searchInput.val();
    query = query.toString();
    query = query.trim();

    // need to add &search to search terms with phrases to pass to the BB API
    query = query.replace(" ", "&search=");

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

                // these remain as empty arrays even after this function runs; will be populated through populteStores function
                let productStores = [];
                let productStoreAddresses = [];

                let productURL = allReturnedProducts[i].url;

                if (productPrice > spendLow && productPrice < spendCap) {

                    allMatchingProducts[allMatchingProductsI] = { "name": productName, "imageSource": productImageSrc, "sku": productSKU, "price": productPrice, "stores": productStores, "storeAddresses": productStoreAddresses, "url": productURL };

                    allMatchingProductsI++;
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

    console.log(allMatchingProducts);

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

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

            allMatchingProducts[i].stores.push(JSON.stringify(storeResponse.stores[x].name));
            allMatchingProducts[i].storeAddresses.push(JSON.stringify(storeResponse.stores[x].address));
        }
    }

    // remove cute loading text

    loadingDiv.addClass("invisible");

    // do not want populateResults to run until all stores have been populated
    populateResults();

    // populateStoreMarkers also needs to wait for store population becuase it uses the populated storeAddress array within allMatchingProducts
    populateStoreMarkers();
}


// sortProducts actually runs before populateStores. it sorts all products in the original return to allMatchingProducts form price-low to price-high.

function sortProducts() {

    console.log("sortProducts running");

    allMatchingProducts.sort((a, b) => {

        return a.price - b.price;
    });

    // note that populateStores is only called after sorting is finished.
    populateStores();

}

// populateResults creates the results on the page after populateStores has run.

function populateResults() {

    console.log("populateResults running");

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

        if (allMatchingProducts && allMatchingProducts.length) {

            let productDiv = $("<div></div>").addClass("product-div max-w-sm rounded overflow-hidden shadow-lg border border-black");

            let namePara = $("<p></p>").addClass("font-bold").text(allMatchingProducts[i].name);

            let pricePara = $("<p></p>").text("$" + allMatchingProducts[i].price);

            productDiv.append(namePara, pricePara);

            let productImage = $("<img></img>").attr("src", allMatchingProducts[i].imageSource);
            productDiv.append(productImage);

            let storeDiv = $("<div></div>");

            if (allMatchingProducts[i].stores && allMatchingProducts[i].stores.length) {

                let storeHeader = $("<h4></h4>").text("Available at:");
                storeDiv.append(storeHeader);

                let storeUl = $("<ul></ul>").addClass("list-disc");

                for (x = 0; x < allMatchingProducts[i].stores.length - 1; x++) {

                    let store = allMatchingProducts[i].stores[x];
                    store.replace("\"", "");
                    let storeLi = $("<li></li>").text(store);
                    storeUl.append(storeLi);
                }

                storeDiv.append(storeUl);

                // want to write the BB product URL to the page if there are no local stores. allows the user to order online if they cannot get locally.
            } else {

                let storeHeader = $("<h4></h4>").text("Not available locally!");
                storeDiv.append(storeHeader);

                let storePara = $("<p>Try online at " + allMatchingProducts[i].url + "</p>");
                storeDiv.append(storePara);
            }

            productDiv.append(storeDiv);

            resultsShow.append(productDiv);
        }

        else {
            let productDiv = $("<div></div>").text("No results. Try upping the max spend, cheapskate! (Just kidding, Cheap Cheap loves you.)");

            resultsShow.append(productDiv);
        }
    }
}

// the on.click order. returnProducts calls sortProducts and sortProducts calls populateStores, so sortProducts and populateStores do not need to be seperately called. 

searchBtn.on("click", function () {

    resultsShow.empty();

    resultsSection.removeClass("invisible");

    // add cute loding text
    loadingDiv.removeClass("invisible");

    spendRange();

    returnProducts();
})

// shhh. easter egg. don't tell.

spyKidsButton.on("click", function () {

    resultsShow.empty();

    resultsSection.removeClass("invisible");

    loadingDiv.removeClass("invisible");

    let randomSpyKid = Math.floor(Math.random() * 9);

    $.ajax({

        // using this app as a quick fix to avoid CORS errors
        url: "https://api.bestbuy.com/v1/products((search=spy&search=kids))?apiKey=GGmupVaRMy1eDvoIlNss1A0G&format=json",
        method: "GET",

    })

        .then(function (response) {

            let productDiv = $("<div></div>").addClass("product-div max-w-sm rounded overflow-hidden shadow-lg border border-black");

            let namePara = $("<p></p>").addClass("font-bold").text(response.products[randomSpyKid].name);

            let pricePara = $("<p></p>").text("$" + response.products[randomSpyKid].salePrice);

            productDiv.append(namePara, pricePara);

            let productImage = $("<img></img>").attr("src", response.products[randomSpyKid].thumbnailImage);
            productDiv.append(productImage);

            loadingDiv.addClass("invisible");

            resultsShow.append(productDiv);
        })
})

// initialize map on page load.

var map, infoWindow, geocoder;

function initMap() {

    console.log("initMap running");

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.2672, lng: -97.7431 },
        zoom: 10
    });
    infoWindow = new google.maps.InfoWindow;

    $.get("https://ipinfo.io?token=d92f854e302724", function (response) {

        var coordinates = response.loc.split(",");

        var pos = {
            lat: parseFloat(coordinates[0]),
            lng: parseFloat(coordinates[1])
        };

        map.setCenter(pos);

        // use this to fee into the main BB functions
        postalCode = response.postal;

    }, "jsonp");
}

// this loops through the final allMatchingProducts object we create above and creates map markers for each store returning

function populateStoreMarkers() {

    console.log("populateStoreMarkers running");

    geocoder = new google.maps.Geocoder();

    var marker, i;

    for (i = 0; i < allMatchingProducts.length - 1; i++) {

        if (allMatchingProducts[i].stores && allMatchingProducts[i].stores.length) {

            for (x = 0; x < allMatchingProducts[i].storeAddresses.length - 1; x++) {

                var storeAddress = allMatchingProducts[i].storeAddresses[x];
                console.log(storeAddress);

                var storeName = allMatchingProducts[i].stores[x];
                console.log(storeName);

                geocoder.geocode({ 'address': storeAddress, }, function (results, status) {

                    if (status == 'OK') {
                        map.setCenter(results[0].geometry.location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                        });

                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });

                // google.maps.event.addListener(marker, "click", function () {
                //     infowindow.setContent(
                //         "<div><strong>" +
                //         storeName +
                //         "</strong><br>" +
                //         "<br>" +
                //         storeAddress +
                //         "</div>"
                //     );
                // })
            }
        }
    }
}
