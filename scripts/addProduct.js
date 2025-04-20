
// document.getElementById("addProductLink").className = "nav-link active";
window.onload = function() {
    const addProductLink = document.getElementById("addProductLink");
    if (addProductLink && window.location.pathname.includes("addProduct.html")) {
        addProductLink.classList.add("active");
    }
};
class Product
{
    sales = 0;
    constructor(product_id, product_name, product_price, product_description, product_category, available_quantity, comment, product_image, seller_id)
    {
        this.product_id = product_id;
        this.product_name = product_name;
        this.product_price = product_price;
        this.product_description = product_description;
        this.product_category = product_category;
        this.available_quantity = available_quantity;
        this.comment = comment;
        this.product_image = product_image;
        this.seller_id = seller_id;
    }
}

$("#addBtn").click(async()=>
    {
    let productName = $("#product_name").val();
    let productPrice = $("#product_price").val();
    let productDescription = $("#product_description").val();
    let productCategory = $("#product_category").val();
    let quantity = $("#available_quantity").val();
    let comment = $("#comment").val();
    let picURL = $("#picURL").val();
    let productImage = await convertPic(picURL);
    let seller = JSON.parse(localStorage.getItem("currentUser"));

    if(productName == "" || productPrice == "" || productDescription == "" || productCategory == "" || quantity == "" || comment == "" || !productImage)
    {
  
        alert("Please complete all required fields");
        return;
    }
    else
    {
        let products = JSON.parse(localStorage.getItem("products"));
        let newProduct = new Product (
            1,
            productName,
            productPrice,
            productDescription,
            productCategory,
            quantity,
            comment,
            productImage,
            seller.sellerId
        );
        if(products)
        {
            newProduct.product_id = products[products.length - 1].product_id +1;
            products.push(newProduct);
            localStorage.setItem("products", JSON.stringify(products));
        }
        else
        {
            localStorage.setItem("products", JSON.stringify([newProduct]));
        }
    }
    alert("New Product created successfully");
    window.location.href = "./home.html";

})

function convertPic(picURL) 
{
    return new Promise((resolve)=>
    {
        const file = document.getElementById("picOption").files[0];
        if(!file)
        {
            resolve(picURL);
        }
        else
        {
            const reader = new FileReader();
            reader.onload = function () 
            {
                const base64 = reader.result;
                resolve(base64);
            }
            reader.readAsDataURL(file); 
        }
    });
}

