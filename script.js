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

    let postalCode = "78751";

    let queryURL = "((search=" + query + ")";

    let activeProducts = "&sku=*";

    let inStoreURL = "&inStoreAvailability=true)?";

    let pageSize = "pageSize=100"

    let cursorMark = "&cursorMark=*"

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
})