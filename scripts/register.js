
//register form bootsrap template- google

class User {
    constructor(username, password, email, phone, gender, city, userId, profilePic) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.gender = gender;
        this.city = city;
        this.userId = userId;
        this.profilePic = profilePic;
    }
}

class Seller {
    constructor(username, password, email, phone, gender, city, sellerId, profilePic) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.gender = gender;
        this.city = city;
        this.sellerId = sellerId;
        this.profilePic = profilePic;
    }
}
$("#registerBtn").click(async(event) => {
    event.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    let city = $("#city").val();

    let genderOption = document.getElementsByName("genderOptions"); // array
    let gender = null;
    for (let i in genderOption) 
        {
        if (genderOption[i].checked) 
        {
            gender = genderOption[i].value;
            break;
        }
    }
    let configOption = document.getElementsByName("userOrSellerOptions"); // array
    let config = null;
    for (let i in configOption) {
        if (configOption[i].checked) {
            config = configOption[i].value;
            break;
        }
    }

    //let picURL = $("#picURL").val();
    let profilePic = await convertPic();
    console.log(profilePic);
    
    if (!username || !password || !email || !phone || !city || !gender || !config || !profilePic) 
        {
            alert("Please complete all required fields");
            return;
        }


    if(isEmailExists(email))
    {
        alert("Email already exists");
        clearInputs();
        return;
    }

    if (config == "user") {
        let newUser = new User(username, password, email, phone, gender, city);
        let users = JSON.parse(localStorage.getItem("users"));
        newUser.profilePic = profilePic;
        if(users) 
        {
            // for(let user of users)
            // {
            //     console.log(user);
            //     console.log(user.email);
            // if(user.email == email)
            // {
            //     alert("Email already exists");
            //     clearInputs();
            //     return;
            // }
            // }
            newUser.userId = users[users.length - 1].userId + 1;
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
        }
        else 
        {
            newUser.userId = 1;
            localStorage.setItem("users", JSON.stringify([newUser]));
        }
    }
    else 
    {
        let newSeller = new Seller(username, password, email, phone, gender, city);
        let sellers = JSON.parse(localStorage.getItem("sellers"));
        newSeller.profilePic= profilePic;
        if (sellers) 
        {
            // for(let seller of sellers)
            // {
            //     if(seller.email == email)
            //     {
            //         alert("Email already exists");
            //         clearInputs();
            //         return;
            //     }
            // }
            newSeller.sellerId = sellers[sellers.length - 1].sellerId + 1;
            sellers.push(newSeller);
            localStorage.setItem("sellers", JSON.stringify(sellers));
        }
        else 
        {
            newSeller.sellerId = 1;
            localStorage.setItem("sellers", JSON.stringify([newSeller]));
        }
    }
    clearInputs();
    alert(`new ${config.toUpperCase()} created`);
    window.location.href = "./login.html";
});

function convertPic() {
    return new Promise((resolve) => {
        const file = document.getElementById("picOption").files[0];
        if (!file) 
        {
            resolve("../images/profileDefault.png");
            return;
        }
       else 
       {
            const reader = new FileReader();
            reader.onload = function () {
                const base64 = reader.result;
                resolve(base64);
            };
            reader.readAsDataURL(file);
        }
    });
}


function clearInputs()
{
    $("#username").val("");
    $("#password").val("");
    $("#email").val("");
    $("#phone").val("");
    $("#city").val("");
    $("#picOption").val("");
    let genderOptions = document.getElementsByName("genderOptions");
    for (let i in genderOptions) 
        {
            genderOptions[i].checked = false;
        }
        let userOrSellerOptions = document.getElementsByName("userOrSellerOptions");
        for (let i in userOrSellerOptions) 
    {
        userOrSellerOptions[i].checked = false;
    }
}

function isEmailExists(email)
{
    let users = JSON.parse(localStorage.getItem("users"))||[];
    let sellers = JSON.parse(localStorage.getItem("sellers"))||[];
    const combinedUsersSellers= users.concat(sellers);
    console.log(combinedUsersSellers);
    
    for(let i=0; i<combinedUsersSellers.length; i++) 
    {
        if(combinedUsersSellers[i].email == email)
        {
            return true;
        }
    }
    return false;
}