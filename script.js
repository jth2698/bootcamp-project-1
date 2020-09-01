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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function() {
            alert("You are welcome to use our search but we will not be able to show you local stores without your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser. Please feel free to use our search.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);
}

getLocation();