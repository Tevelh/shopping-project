$("#loginBtn").click((event) => 
{
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    
    if (!email ||!password)
    {
        alert("Please enter both email and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users"));
    const sellers= JSON.parse(localStorage.getItem("sellers"));

    if(users)
    {
        for(let i in users)
        {
            let user = users[i];
            if(user.email == email)
            {
                if(user.password == password)
                {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    window.location.href = "home.html";
                    return;
                }
                else
                {
                    alert("Invalid password.");
                    return;
                }
            }
        }
    }

    if(sellers)
    {
        for(let i in sellers)
        {
            let seller = sellers[i];
            if(seller.email == email)
            {
                if(seller.password == password)
                {
                    localStorage.setItem("currentUser", JSON.stringify(seller));
                    window.location.href = "home.html";
                    return;
                }
                else
                {
                    alert("Invalid password.");
                    return;
                }
            }
        }
    }
    alert("No User / Seller found");

})