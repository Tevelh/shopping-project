let wishlistProducts = JSON.parse(localStorage.getItem('wishlist'));
let products = JSON.parse(localStorage.getItem('products'));
let loggedInConfig = JSON.parse(localStorage.getItem('currentUser'));
let cartItems = JSON.parse(localStorage.getItem('buyerCart'));

class Order
{
    constructor(orderId, productId, buyerId, orderStatus,quantity, priceItem)
    {
        this.orderId = orderId;
        this.productId = productId;
        this.buyerId = buyerId;
        this.orderStatus = orderStatus; 
        this.quantity = quantity;
        this.priceItem = priceItem;
    }
}


if (wishlistProducts) 
{
    for(let i in wishlistProducts)
    {
        let wishlistProductId = wishlistProducts[i];
        for(let j in products)
        {
            if(products[j].product_id == wishlistProductId)
            {
                let product = products[j];
            $("#wishlistContent").append(
                `
                <div class="card rounded-3 mb-4">
                    <div class="container h-100 py-5">
                        <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="col-md-2 col-lg-2 col-xl-2">
                                <img src=${product.product_image}
                                    class="img-fluid rounded-3" alt="Cotton T-shirt">
                            </div>
                            <div class="col-md-3 col-lg-3 col-xl-3">
                                <p class="lead fw-normal mb-2">${product.product_name}</p>
                                <p><span class="text-muted">${product.product_description} </span></p>
                            </div>
                            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                <h5 class="mb-0">${product.product_price}</h5>
                            </div>
                            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                <a onclick="deleteProductFromWishlist(${product.product_id})" class="text-danger"><i class="fas fa-trash fa-lg" id="trash"></i></a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                `
            )
    
            }
        }
    
    }
}
else 
{
    $("#wishlistContent").append(`No items in wishlist`);
}



function addToCart(productId)
{
    let cartItems = JSON.parse(localStorage.getItem("cart")) || {};
    let cartQuantity = cartItems[productId] || 1;
    
    let product;
    for (let i = 0; i < products.length; i++) 
    {
        if (products[i].product_id == productId) 
        {
            product = products[i];
            break;
        }
    }

    if (loggedInConfig) {
        if (product) {
            let productPrice = parseFloat(product.product_price.replace("$", ""));
            let newOrder = new Order(
                1,
                product.product_id,
                "userId/SellerId",
                "Pending",
                cartQuantity,
                productPrice * cartQuantity
            );
            console.log(productPrice);

            if (newOrder.quantity > product.available_quantity) {
                alert("Not enough stock available. Only " + product.available_quantity + " items in stock.");
                return;
            }

            if (loggedInConfig.sellerId) {
                newOrder.buyerId = loggedInConfig.sellerId;
                let sellersOrders = JSON.parse(localStorage.getItem('sellersOrders')) || [];
                let existingOrderIndex = -1;
                
                for (let i in sellersOrders) {
                    if (sellersOrders[i].productId == product.product_id && 
                       sellersOrders[i].buyerId == loggedInConfig.sellerId &&
                       sellersOrders[i].orderStatus == "Pending") {
                        existingOrderIndex = i;
                        break;
                    }
                }
                
                if (existingOrderIndex !== -1) {
                    sellersOrders[existingOrderIndex].quantity += cartQuantity;
                    if (sellersOrders[existingOrderIndex].quantity > product.available_quantity) {
                        alert("Not enough stock available. Only " + product.available_quantity + " items in stock.");
                        return;
                    }
                    sellersOrders[existingOrderIndex].priceItem = productPrice * sellersOrders[existingOrderIndex].quantity;
                    localStorage.setItem("sellersOrders", JSON.stringify(sellersOrders));
                    alert("Order updated successfully");
                    window.location.reload();
                } else {
                    sellersOrders.push(newOrder);
                    localStorage.setItem("sellersOrders", JSON.stringify(sellersOrders));
                    alert("Order placed successfully");
                    window.location.reload();
                }
            } 
            else // user
            {
                newOrder.buyerId = loggedInConfig.userId;
                let usersOrders = JSON.parse(localStorage.getItem('usersOrders')) || [];
                let existingOrderIndex = -1;
                
                for (let i in usersOrders) {
                    if (usersOrders[i].productId == product.product_id && 
                        usersOrders[i].buyerId == loggedInConfig.userId &&
                        usersOrders[i].orderStatus == "Pending") {
                        existingOrderIndex = i;
                        break;
                    }
                }
                
                if (existingOrderIndex !== -1) {
                    usersOrders[existingOrderIndex].quantity += cartQuantity;
                    if (usersOrders[existingOrderIndex].quantity > product.available_quantity) {
                        alert("Not enough stock available. Only " + product.available_quantity + " items in stock.");
                        return;
                    }
                    usersOrders[existingOrderIndex].priceItem = productPrice * usersOrders[existingOrderIndex].quantity;
                    localStorage.setItem("usersOrders", JSON.stringify(usersOrders));
                    alert("Order updated successfully");
                    window.location.reload();
                } else {
                    usersOrders.push(newOrder);
                    localStorage.setItem("usersOrders", JSON.stringify(usersOrders));
                    alert("Order placed successfully");
                    window.location.reload();
                }
            }
        } 
        else {
            alert("No product available");
        }
    } else {
        alert("You must be logged in to place an order");
    }
};

function deleteProductFromWishlist(id)
{
    for(let x in wishlistProducts)
    {
        if(wishlistProducts[x] == id)
        {
            wishlistProducts.splice(x, 1);
            localStorage.setItem("wishlist", JSON.stringify(wishlistProducts));
            window.location.reload();
            return;
        }
    }
    alert("Product not found in wishlist");

}

function goToCart()
{
    window.location.href = "./cart.html";
}
