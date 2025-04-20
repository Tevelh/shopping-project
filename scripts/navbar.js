
let currentUser= JSON.parse(localStorage.getItem("currentUser"));

$("#navbarContent").append(
    `
    <nav class="navbar navbar-expand-lg" id="navbar">
        <div class="container-fluid" >
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="ulMenu">
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="./home.html" id="homeLink">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./cart.html">Cart
                <span class="badge text-bg-secondary"><strong id="cartSize"></strong></span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./wishlist.html">WishList</a>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 profile-menu"> 
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div class="profile-pic">
                      <img id="profilePic" src="" alt="Profile Picture">
                   </div>
               <!-- You can also use icon as follows: -->
                 <!--  <i class="fas fa-user"></i> -->
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown" id="dropdown-menu">
                  <li><a class="dropdown-item" href="./account.html"><i class="fas fa-sliders-h fa-fw"></i> Account</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" onclick="logout()"><i class="fas fa-sign-out-alt fa-fw"></i> Log Out</a></li>
                </ul>
              </li>
           </ul>
          </div>
        </div>
      </nav>

    `
)


if(!currentUser)
{
    $("#profilePic").hide();
    $("#dropdown-menu").addClass("d-none");
    
    let regBtn= document.createElement("button");
    let loginBtn= document.createElement("button");
    let divBtn = document.createElement("div");
    regBtn.textContent="Register";
    loginBtn.textContent="Login";
    regBtn.classList.add("btn", "btn-outline-primary", "fw-bold", "me-2");
    loginBtn.classList.add("btn", "btn-outline-secondary", "fw-bold");
    regBtn.onclick = () => window.location.href = "./register.html";
    loginBtn.onclick = () => window.location.href = "./login.html";
    divBtn.classList.add("d-flex", "justify-content-end", "m-3");
    divBtn.append(regBtn, loginBtn);

    $("#navbarSupportedContent").append(divBtn);

}
else
{
    $("#profilePic").attr("src", currentUser.profilePic);
    if(currentUser.sellerId)// check if user is a seller
    {
      const newItem = document.createElement("li");
      newItem.classList.add("nav-item");
      const newLink = document.createElement("a");
      newLink.classList.add("nav-link");
      newLink.id = "addProductLink";
      newLink.textContent = "Add Product";
      newLink.href = "./addProduct.html";
      newItem.appendChild(newLink);
      $("#ulMenu").append(newItem);
      $("#ulMenu").append(
        `
        <li class="nav-item">
            <a class="nav-link" href="./myProducts.html">My Products</a>
        </li>
        `
      )

    let cartSize = localStorage.getItem("cartSize");
    $("#cartSize").text(cartSize);
    }
    else
    {
      let cartSize = localStorage.getItem("cartSize");
      $("#cartSize").text(cartSize);
    }

    if (window.location.pathname.includes("addProduct.html")) {
        $("#addProductLink").addClass("active");
    }

    if (window.location.pathname.includes("home.html")) {
        $("#homeLink").addClass("active");
    }

}

function logout(event)
{
    //event.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("buyerCart");
    window.location.href="./home.html";
}