
//document.getElementById("homeLink").className = "nav-link active";
document.addEventListener("DOMContentLoaded", function() 
{
    if(localStorage.getItem("PaymentSuccess") == "true")
    {
        let toastElement = document.getElementById("toast");
        let toast = new bootstrap.Toast(toastElement,
            {
                autohide: true,
                delay: 4000
            }
        );
        toast.show();
        localStorage.removeItem("PaymentSuccess");
    }
});

$(document).ready(() =>
    {
        let products= JSON.parse(localStorage.getItem("products"));
        if(!products)
        {
            $("products-title").text("No products available");
        }
        else
        {
            $("#products-title").text(`All Products`);
            for(let i=0; i<products.length; i++)
            {
                let product= products[i];
                $("#carouselProductsUp").append(`
                    <div class="carousel-item ${i === 0 ? "active" : ""}">
                        <div class="carousel-card">
                            <div id="carousel-img">
                            <img class="carousel-img" src="${product.product_image}" alt="${product.product_name}">
                            </div>
                            <div class="carousel-caption">
                                <h5>${product.product_name}</h5>
                                <a href="./product.html?productId=${product.product_id}" class="btn btn-outline-secondary">More Details</a>
                            </div>
                        </div>
                    </div>
                `);
                $("#all-products").append(
                    `
                    <div class="card h-100" style="width: 30%">
                        <img class="card-img-top" src="${product.product_image}" alt="${product.product_name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.product_name}</h5>
                            <p class="card-text">${product.product_description}</p>
                            <a href="./product.html?productId=${product.product_id}" class="btn btn-outline-secondary">More Details</a>
                        </div>
                    </div>
                    `
                )
            }
            for(let i=0; i<products.length; i++) 
            {
                for(let j=0; j<products.length-1-i;j++)
                {
                    if(products[j].sales < products[j+1].sales)
                    {
                        let temp = products[j];
                        products[j] = products[j+1];
                        products[j+1] = temp;
                    }
                }
            }
            $("#carouselProductsBestSales").append(
                `
                <h6>Best Sales</h6>
                `);
            for(let i=0; i<3; i++)
            {
                let product= products[i];
                $("#carouselProductsBestSales").append(
                    `
                    <div class="carousel-item ${i === 0 ? "active" : ""}">
                        <div class="carousel-card">
                            <div id="carousel-img">
                            <img class="carousel-img" src="${product.product_image}" alt="${product.product_name}">
                            </div>
                            <div class="carousel-caption">
                                <h5>${product.product_name}</h5>
                                <a href="./product.html?productId=${product.product_id}" class="btn btn-outline-secondary">More Details</a>
                            </div>
                        </div>
                    </div>
                    `
                )
            }
        }
    })