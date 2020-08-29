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
