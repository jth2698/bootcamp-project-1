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