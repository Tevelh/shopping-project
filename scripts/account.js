
$("#inputUsername").val(currentUser.username);
$("#inputEmail").val(currentUser.email);
$("#inputCity").val(currentUser.city);
$("#inputPhone").val(currentUser.phone);
$("#inputPassword").val(currentUser.password);

$("#newProfilePicture").attr("src", currentUser.profilePic);

$("#saveChangesBtn").click(()=>
{
    

    if($("#confirmPassword").val() == "" || $("#inputConfirmPassword").val() != currentUser.password)
    {
        alert("Please confirm your password correctly");
        return;
    }
    else
    {
        currentUser.username = $("#inputUsername").val();
        currentUser.email = $("#inputEmail").val();
        currentUser.city = $("#inputCity").val();
        currentUser.phone = $("#inputPhone").val();
        currentUser.password = $("#inputPassword").val();
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("User has been updated");
        window.location.reload();
        return;
    }

});

$("#updateProfilePic").click(() => 
{
    $("#pictureInput").click();
});

$("#pictureInput").change(() => 
{
    const file = document.getElementById("pictureInput").files[0];
    if (!file) {
        $("#newProfilePicture").attr("src", "../images/profileDefault.png");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        $("#newProfilePicture").attr("src", reader.result);
    };
    reader.readAsDataURL(file);
});