
let products = JSON.parse(localStorage.getItem('products'));
let currentBuyer = JSON.parse(localStorage.getItem('currentUser'));
let cartArr = [];
let userOrSeller ="";
let cartSize =0;
let priceItem;

if (!currentBuyer) 
{
    $("#cartContent").append(`
        <div class="row" id="emptyCart">
            <div class="col-md-12">Please log in to view your cart.</div>
        </div>
    `);
    document.getElementById("buyAll").style.display = "none";
}

else if(currentBuyer.sellerId)
{
    userOrSeller = "sellers";
    let sellersOrders = JSON.parse(localStorage.getItem(userOrSeller + "Orders"));
    for(let i in sellersOrders)
    {
        let order = sellersOrders[i];
        if(order.buyerId == currentBuyer.sellerId && order.orderStatus !="Paid")
        {
            cartArr.push(order);
            cartSize++;
        }
    }
    localStorage.setItem("cartSize", JSON.stringify(cartSize));
}
else
{
    userOrSeller = "users";
    let usersOrders = JSON.parse(localStorage.getItem(userOrSeller + "Orders"));
    for(let i in usersOrders)
    {
        let order = usersOrders[i];
        if(order.buyerId == currentBuyer.userId && order.orderStatus !="Paid")
        {
            cartArr.push(order);
            cartSize++;
        }
    }
    localStorage.setItem("cartSize", JSON.stringify(cartSize));
}

let totalAmount = 0;
if(cartArr.length > 0)
{
    for(let i in cartArr)
    {
        let cartItem = cartArr[i];
        //let totalAmount = cartItem.totalAmount;
        console.log(cartItem);
        
        for(let x in products)
        {
            let product = products[x];
            // if(cartItem.priceItem)
            // {
            //     priceItem = parseFloat(cartItem.priceItem.replace("$", ""));
            // }
            // else
            // {
            //     priceItem = product.product_price;
            // }
            if(product.product_id == cartArr[i].productId && cartArr[i].orderStatus == "Pending")
            {
                let price= parseFloat(product.product_price.replace("$", ""));
                let quantity = parseInt(cartItem.quantity);
                priceItem = price * quantity;
                totalAmount += price * quantity;
                console.log(totalAmount);
                $("#cartContent").append(`
                    <div class="card rounded-3 mb-4">
                            <div class="card-body p-4">
                                <div class="row d-flex justify-content-between align-items-center">
                                    <div class="col-md-2 col-lg-2 col-xl-2">
                                        <img src="${product.product_image}" class="img-fluid rounded-3" alt="${product.product_name}">
                                    </div>
                                    <div class="col-md-3 col-lg-3 col-xl-3">
                                        <p class="lead fw-normal mb-2">${product.product_name}</p>
                                        <p><span class="text-muted">${product.product_description}</span></p>
                                    </div>
                                    <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                        <button class="btn btn-link px-2" onclick="updateQuantity(${product.product_id}, -1)">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input id="quantity-${product.product_id}" min="1" name="quantity" type="number"
                                            class="form-control form-control-sm" value="${quantity}" onchange="updateTotalAmount()">
                                        <button class="btn btn-link px-2" onclick="updateQuantity(${product.product_id}, 1)">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                        <h5 class="mb-0" id="price-${product.product_id}">$${priceItem}</h5>
                                    </div>
                                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                        <a onclick="deleteProduct(${product.product_id})" class="text-danger">
                                            <i class="fas fa-trash fa-lg"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                `);
            }
        }
    }
    
    $("#cartContent").append(
        `
        <div class="row" id="totalAmount">
            <div class="col-md-12"><strong>Total Amount: ${totalAmount}$</strong></div>
        </div>
        `
    );
    document.getElementById("buyAll").style.display = "block";

}
else if(currentBuyer)
{
    $("#cartContent").append(
        `
        <div class="row" id="emptyCart">
            <div class="col-md-12">Your cart is empty.</div>
        </div>
        `
    );
    document.getElementById("buyAll").style.display = "none";
}
localStorage.setItem("buyerCart", JSON.stringify(
    { 
        config: userOrSeller, 
        cart: cartArr,
        priceItem,
        totalAmount 
    }));

function updateQuantity(productId, change) {
    let quantityInput = document.getElementById(`quantity-${productId}`);
    if (!quantityInput) {
        return;
    }

    let product;
    for (let i in products) {
        if (products[i].product_id == productId) {
            product = products[i];
            console.log(product);
            break;
        }
    }

    console.log(product);
    if (!product) {
        console.error("Product not found");
        return;
    }

    let availableQuantity = product.available_quantity;
    let newQuantity = parseInt(quantityInput.value) + change;

    if (newQuantity < 1) {
        newQuantity = 1;
    } 
    else if (newQuantity > availableQuantity) {
        alert('There are only ' + availableQuantity + ' items available');
        newQuantity = availableQuantity;
    }

    quantityInput.value = newQuantity;

    for (let i in cartArr) {
        if (cartArr[i].productId === productId) {
            cartArr[i].quantity = newQuantity;
            break;
        }
    }

    let orders = JSON.parse(localStorage.getItem(userOrSeller + "Orders")) || [];
    for (let i in orders) {
        if (orders[i].productId == productId && 
            ((currentBuyer.sellerId && orders[i].buyerId == currentBuyer.sellerId) || 
                (currentBuyer.userId && orders[i].buyerId == currentBuyer.userId))) {
            orders[i].quantity = newQuantity;
            break;
        }
    }
    localStorage.setItem(userOrSeller + "Orders", JSON.stringify(orders));

    updateTotalAmount();
}
    
function updateTotalAmount() 
{
    let totalAmount = 0;

    for (let i in cartArr) {
        for (let x in products) {
            let product = products[x];

            if (product.product_id === cartArr[i].productId) 
            {
                let quantityInput = document.getElementById(`quantity-${product.product_id}`);
                let priceInput = document.getElementById(`price-${product.product_id}`);
                let quantity = parseInt(quantityInput.value) || 1;
                let price = parseFloat(product.product_price.replace("$", ""));
                priceInput.innerText = price * quantity + "$";
                priceItem = price * quantity + "$";
                totalAmount += price * quantity;
                break;
            }
        }
    }

    let totalAmountDiv = document.getElementById("totalAmount");
    if (totalAmountDiv) 
    {
        totalAmountDiv.innerHTML = `<div class="col-md-12"><strong>Total Amount: $${totalAmount}</strong></div>`;
    }

    if(totalAmount > 0)
    {
        document.getElementById("buyAll").style.display = "block";
    }
    else
    {
        document.getElementById("buyAll").style.display = "none";
    }

    localStorage.setItem("buyerCart", JSON.stringify(
    { 
        config: userOrSeller, 
        cart: cartArr,
        priceItem,
        totalAmount
    }));
}
function deleteProduct(id)
{
    let orders = JSON.parse(localStorage.getItem(userOrSeller + "Orders"));
    for(let x in orders)
    {
        if(orders[x].productId == id)
        {
            orders.splice(x, 1);
            localStorage.setItem(userOrSeller + "Orders", JSON.stringify(orders));
            for(let i in cartArr)
            {
                if(cartArr[i].productId == id)
                {
                    cartArr.splice(i, 1);
                    localStorage.setItem("cartSize", JSON.stringify(cartArr.length));
                    localStorage.setItem("buyerCart", JSON.stringify(cartArr));
                    break;
                }
            }
            window.location.reload();
            return;
        }
    }
    alert("Product not found in cart");

}

function goToPayment()
{
    if(cartArr.length > 0)
    {
        for (let i in cartArr)
        {
            let cartItem = cartArr[i];
            let product = products.find(p => p.product_id === cartItem.productId);

            if (!product || product.available_quantity <= 0)
            {
                alert("The item is out of stock");
                return;
            }
        }
        window.location.href = "./payment.html";
    }
    else
    {
        alert("Your cart is empty.");
        window.location.href = "./home.html";
    }
}