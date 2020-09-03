const spendCap = 200;
const spendLow = spendCap - (spendCap * .25);

const searchInput = $("#search-input");
const searchBtn = $("#search-button");

const resultsContainer = $("#results-container");

searchBtn.on("click", function () {

    resultsContainer.empty();

    const baseURL = "https://api.bestbuy.com/v1/products";

    let query = searchInput.val();
    query = query.toString();
    query = query.trim();

<<<<<<< HEAD
    console.log(query);
=======
    let postalCode = "78751";
>>>>>>> 802fcde88b60263bdb48ee4004207ca31181caf6

    let queryURL = "((search=" + query + ")";

    let activeProducts = "&sku=*";

    let inStoreURL = "&inStoreAvailability=true)?";

    let pageSize = "pageSize=100"

 fix-bb-api-instoreavailability-bug
    let cursorMark = "&cursorMark=*"

    console.log(query);

    var BBApiKey = "GGmupVaRMy1eDvoIlNss1A0G";
 master

    let format = "&format=json";

    let BBAPIKey = "&apiKey=GGmupVaRMy1eDvoIlNss1A0G";

    let productURL = baseURL + queryURL + activeProducts + inStoreURL + pageSize + cursorMark + BBAPIKey + format;

    $.ajax({
        url: productURL,
        method: "GET",

    }).then(function (productResponse) {

        console.log(productURL);

        let allReturnedProducts = productResponse.products;

        let allMatchingProducts = [{}];

        for (i = 1; i < allReturnedProducts.length - 1; i++) {

            let productName = allReturnedProducts[i].name;
            let productImageSrc = allReturnedProducts[i].thumbnailImage;
            let productSKU = allReturnedProducts[i].sku;
            let productPrice = allReturnedProducts[i].salePrice;

            if (productPrice > spendLow && productPrice < spendCap) {

                allMatchingProducts[i] = { "name": productName, "imageSource": productImageSrc, "sku": productSKU, "price": productPrice };
            }
        }

<<<<<<< HEAD
        console.log(allProductSKUs);
    })
=======
        allMatchingProducts.sort((a, b) => {
            return a.price - b.price;
        });

        console.log(allMatchingProducts);

        for (i = 1; i < allMatchingProducts.length; i++) {

            console.log(allMatchingProducts[i]);

            let skuInsert = "/" + allMatchingProducts[i].sku + "/stores.json?";

            let postalCodeInsert = "postalCode=" + postalCode;

            let storeURL = baseURL + skuInsert + postalCodeInsert + BBAPIKey;

            $.ajax({
                url: storeURL,
                method: "GET",

            }).then(function (storeResponse) {

                if (storeResponse.stores != "") {

                    console.log(storeURL);

                    productDiv = $("<div></div>");
                    productDiv.text(allMatchingProducts[i].name);

                    productImage = $("<img></img>");
                    productImage.attr("src", allMatchingProducts[i].imageSource);
                    productDiv.append(productImage);

                    storeDiv = $("<div></div>");

                    storeHeader = $("<h4></h4>");
                    storeHeader.text("Available at:");
                    storeDiv.append(storeHeader);

                    for (i = 0; i < storeResponse.stores.length - 1; i++) {
                        console.log(storeResponse.stores[i].name);
                        storePara = $("<p></p>");
                        storePara.text(storeResponse.stores[i].name);
                        storeDiv.append(storePara);
                    }

                    productDiv.append(storeDiv);

                    resultsContainer.append(productDiv);
                }

            })

        }
    })
 fix-bb-api-instoreavailability-bug
})

>>>>>>> 802fcde88b60263bdb48ee4004207ca31181caf6
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
