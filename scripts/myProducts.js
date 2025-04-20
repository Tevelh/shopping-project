
let modal = document.getElementById("modal");
const products = JSON.parse(localStorage.getItem("products"));
let myProducts = [];
let currentProductId = null;


for (let i in products) {
    let product = products[i];
    $("#newProductPicture").attr("src", product.product_image);
    if (product.seller_id == currentUser.sellerId) {
        myProducts.push(product);
    }

}
if (myProducts.length > 0) {
    for (let i in myProducts) {
        let product = myProducts[i];
        $("#myProductsContent").append(
            `
            <div class="card" style="width: 18rem;">
                <img src="${product.product_image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.product_name}</h5>
                    <p class="card-text">Price: ${product.product_price}</p>
                    <p class="card-text">Quantity: ${product.available_quantity}</p>
                    <p class="card-text">Description: ${product.product_description}</p>
                    <p class="card-text">Comment: ${product.comment}</p>
                    <p class="card-text">Sales: ${product.sales}</p>
                    <button type="button" class="btn btn-warning" onclick="editProduct(${product.product_id})">Edit</button>
                    <button type="button" class="btn btn-danger" onclick="deleteProduct(${product.product_id})">Delete</button>
                </div>
            </div>
            `
        )
    }
}

function editProduct(productId) {
    $('#modal').modal('show');
    $('#modal').css("display", "flex");
    currentProductId = productId;
    for (let i in myProducts) {
        let product = myProducts[i];
        if (product.product_id == productId) {
            console.log(product);
            $("#productName").val(product.product_name);
            $("#productPrice").val(product.product_price);
            $("#quantity").val(product.available_quantity);
            $("#description").val(product.product_description);
            $("#comment").val(product.comment);
            $("#newProductPicture").attr("src", product.product_image);
        }

    }

}
$("#updateProductPic").click(() => 
    {
        $("#pictureInput").click();
    });
    
$("#pictureInput").change(() => 
{
    const file = document.getElementById("pictureInput").files[0];
    if (!file) {
        alert("No picture");
    }

    const reader = new FileReader();
    reader.onload = function () {
        $("#newProductPicture").attr("src", reader.result);
    };
    reader.readAsDataURL(file);
});

function deleteProduct(productId) {
    for (let i in products) {
        const product = products[i];
        if (product.product_id == productId) {
            products.splice(i, 1);
            localStorage.setItem("products", JSON.stringify(products));
            window.location.reload();
            return;
        }
        else {
            alert("Product not found");
            return;
        }
    }
}
const waiting = (time) => new Promise(resolve => setTimeout(resolve, time * 1000));

async function saveChanges(event) {
    event.preventDefault();
    document.getElementById("waitingSpinner").style.display = "block";
    await waiting(3);
    let productName = $("#productName").val();
    let productPrice = $("#productPrice").val();
    let quantity = $("#quantity").val();
    let description = $("#description").val();
    let comment = $("#comment").val();
    let productPic = $("#newProductPicture").attr("src");

    for(let i in products)
    {
        let product= products[i];
        if(product.product_id == currentProductId)
        {
            product.product_name = productName;
            product.product_price = productPrice;
            product.available_quantity = quantity;
            product.product_description = description;
            product.comment = comment;
            product.product_image = productPic;
            localStorage.setItem("products", JSON.stringify(products));
            break;
        }
    }
    document.getElementById("waitingSpinner").style.display = "none";
    closeEditModal();
    window.location.reload();
}

function closeEditModal() {
    $('#modal').modal('hide');
}