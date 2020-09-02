const searchInput = $("#search-input");
const searchBtn = $("#search-button");

searchBtn.on("click", function () {

    const baseURL = "https://api.bestbuy.com/v1/products";

    let query = searchInput.val();
    query = query.toString();
    query = query.trim();

    let userPostalCode = "";

    let queryURL = "((search=" + query + ")";

    let activeProducts = "&sku=*";

    let inStoreURL = "&inStoreAvailability=true)?";

    let pageSize = "pageSize=100"

    let cursorMark = "&cursorMark=*"

    let format = "&format=json";

    let BBAPIKey = "&apiKey=GGmupVaRMy1eDvoIlNss1A0G";

    let productURL = baseURL + searchType + queryURL + activeProducts + inStoreURL + pageSize + cursorMark + BBAPIKey + format;

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

        for (i = 0; i < allProductSKUs.length; i++) {

            let skuInsert = "/" + allProductSKUs[i] + "/stores.json?";

            let postalCodeInsert = "postalCode=" + postalCode;

            let storeURL = baseURL + skuInsert + postalCodeInsert + BBAPIKey;

            $.ajax({
                url: storeURL,
                method: "GET",

            }).then(function (response) {

                console.log(storeURL);



                let localavailabilityURL = queryURL +

                    https://api.bestbuy.com/v1/stores(area(78751,100))+products(sku%20in())?show=storeId,name,products.sku,products.name&format=json&apiKey=GGmupVaRMy1eDvoIlNss1A0G

                    url_store = 'https://api.bestbuy.com/v1/products/' + document.getElementById('partnumber').value.trim() + '/stores.json?postalCode=' + document.getElementById('zipcode').value.trim() + '&apiKey=08JJS1ffSirGzNn7hMjRcjBN' + '&irclickid=yXE2NrTAhxyJU580MdV3iVCmUklQd9yBr2QUUA0&irgwc=1&ref=198&loc=126338&acampID=614286';
            })

        })