
class Order
{
    constructor(orderId, productId, buyerId, orderStatus, quantity, priceItem)
    {
        this.orderId = orderId;
        this.productId = productId;
        this.buyerId = buyerId;
        this.orderStatus = orderStatus; 
        this.quantity = quantity;
        this.priceItem = priceItem;
    }
}

urlParams= new URLSearchParams(window.location.search);

const productId = urlParams.get('productId');
let currentProduct;
let loggedInConfig = JSON.parse(localStorage.getItem('currentUser'));
if(productId)
{
    let products = JSON.parse(localStorage.getItem('products'));
    for(let i in products)
    {
        let product = products[i];
        if(product.product_id == productId)
        {
            currentProduct = product;
            let heart = "";
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (wishlist.includes(product.product_id)) 
            {
                heart = "liked";
            }
            $("#productContent").append(`
                <div class="d-flex justify-content-center align-items-center vh-90 mt-5">
                    <div class="card shadow-lg p-3 mb-4 bg-white rounded" style="width: 18rem;">
                        <div>
                            <svg id="heartIcon" onclick="saveToWishlist(${product.product_id}, this)" class="heart-icon ${heart}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>                    
                        </div>
                        <div class="d-flex justify-content-center">
                            <img src="${product.product_image}" class="card-img-top mb-3" alt="..." style="width: 50%; border-radius: 10px;">
                        </div>
                        <div class="card-body text-center">
                            <h5 class="card-title mb-2">${product.product_name}</h5>
                            <ul class="list-unstyled mb-3">
                                <li class="mb-1"><strong>Category:</strong> ${product.product_category}</li>
                                <li class="mb-1"><strong>Price:</strong> ${product.product_price}</li>
                                <li class="mb-1"><strong>Quantity:</strong> ${product.available_quantity}</li>
                                <li class="mb-1"><strong>Description:</strong> ${product.product_description}</li>
                                <li class="mb-1"><strong>Comment:</strong> ${product.comment}</li>
                            </ul>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-primary px-3 py-1" id="addToCart">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>

`);
            break;
        }
    }
    if(!currentProduct)
    {
        $("#productContent").append(`No product available`);
    }
    else
    {
        if(currentProduct.available_quantity <= 0)
        {
            $("#addToCart").attr("disabled", "disabled");
            $("#addToCart").text("Sold out");
        }
    }
}

$("#addToCart").click(() => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || {};
    let cartQuantity = cartItems[currentProduct.product_id] || 1;
    
    if (loggedInConfig) {
        if (currentProduct) {
            let productPrice = parseFloat(currentProduct.product_price.replace("$", ""));
            let newOrder = new Order(
                1,
                currentProduct.product_id,
                "userId/SellerId",
                "Pending",
                cartQuantity,
                productPrice * cartQuantity
            );
            console.log(productPrice);

            if (newOrder.quantity > currentProduct.available_quantity) {
                alert("Not enough stock available. Only " + currentProduct.available_quantity + " items in stock.");
                return;
            }

            if (loggedInConfig.sellerId) {
                newOrder.buyerId = loggedInConfig.sellerId;
                let sellersOrders = JSON.parse(localStorage.getItem('sellersOrders')) || [];
                let existingOrderIndex = -1;
                
                for (let i in sellersOrders) {
                    if (sellersOrders[i].productId == currentProduct.product_id && 
                       sellersOrders[i].buyerId == loggedInConfig.sellerId &&
                       sellersOrders[i].orderStatus == "Pending") {
                        existingOrderIndex = i;
                        break;
                    }
                }
                
                if (existingOrderIndex !== -1) {
                    sellersOrders[existingOrderIndex].quantity += cartQuantity;
                    if (sellersOrders[existingOrderIndex].quantity > currentProduct.available_quantity) {
                        alert("Not enough stock available. Only " + currentProduct.available_quantity + " items in stock.");
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
                    if (usersOrders[i].productId == currentProduct.product_id && 
                        usersOrders[i].buyerId == loggedInConfig.userId &&
                        usersOrders[i].orderStatus == "Pending") {
                        existingOrderIndex = i;
                        break;
                    }
                }
                
                if (existingOrderIndex !== -1) {
                    usersOrders[existingOrderIndex].quantity += cartQuantity;
                    if (usersOrders[existingOrderIndex].quantity > currentProduct.available_quantity) {
                        alert("Not enough stock available. Only " + currentProduct.available_quantity + " items in stock.");
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
});


function saveToWishlist(productId, element) 
{
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let found = false;

    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i] == productId) {
            wishlist.splice(i, 1); 
            found = true;
            break;
        }
    }

    if (found) 
    {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Product removed from wishlist successfully");
        element.classList.remove("liked"); 
            
    }
    else 
    {
        wishlist.push(productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Product saved to wishlist successfully");
        element.classList.add("liked"); 

    }
}
