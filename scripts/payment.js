const sleep = (time)=> new Promise(resolve => setTimeout(resolve, time * 1000));
let buyerCart = JSON.parse(localStorage.getItem('buyerCart'));
let products = JSON.parse(localStorage.getItem('products'));
let orders = JSON.parse(localStorage.getItem(buyerCart.config +'Orders'));

if(!buyerCart)
{
    alert("No items in cart");
    window.location.href = "./home.html";
}
else
{
    $("#subTotal").text("$" + buyerCart.totalAmount);
    $("#totalAmount").text("$" + (buyerCart.totalAmount + 20));
}

const checkCouponCode = (coupon) => {
    if (!coupon) 
    {
        return 0; 
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `../data/coupons.json`,
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            success: (data) => {
                let found = false;
                for (let i in data) {
                    if (data[i].couponCode == coupon) {
                        resolve(data[i].discount);
                        found = true;
                        break;
                    }
                }
                if (!found) 
                {
                    alert("Coupon not found");
                    resolve(0);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};


document.getElementById("coupon").addEventListener(
    "change", async ()=>
    {
        document.getElementById("waitingSpinner").style.display = "block";
        await sleep(1);
        let response= await checkCouponCode(document.getElementById("coupon").value);
        console.log(response);
        if(response > 0)
        {
            $("#discount").text("-$" + response);
            let subTotal = $("#subTotal").text().split("$")[1];
            console.log(subTotal);
            $("#totalAmount").text("$" +(subTotal - response + 20));
        }
        else
        {
            $("#totalAmount").text((buyerCart.totalAmount + 20) + "$");
            $("#discount").text("");
        }
        document.getElementById("waitingSpinner").style.display = "none";
    }
)

$("#paymentBtn").click(async(event)=>
{
    event.preventDefault();
    document.getElementById("waitingSpinner").style.display = "block";
    await sleep(3.5);
    for (let i in buyerCart.cart) 
    {
        let order = buyerCart.cart[i];
        for (let x in products) 
        {
            if (products[x].product_id == order.productId) 
            {
                products[x].available_quantity -= order.quantity;
                products[x].sales += order.quantity;
                break;
            }
        }
        for (let x in orders) 
        {
            if (order.orderId == orders[x].orderId) 
            {
                orders[x].orderStatus = "Paid";
            }
        }
    }
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem(buyerCart.config + "Orders", JSON.stringify(orders));
   
    localStorage.setItem("PaymentSuccess", "true");
    
    document.getElementById("waitingSpinner").style.display = "none";
    alert("Payment successful!");
    localStorage.removeItem("buyerCart");
    window.location.href = "./home.html";
    return;
})

