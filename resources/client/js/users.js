function getUsersList() {
    console.log("Invoked getUsersList()");
    const url = "/users/list/";
    fetch(url, {
        method: "GET"
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            alert(JSON.stringify(response));
        }else {
            formatUsersList(response)
        }
    });
}

function formatUsersList(myJSONArray){
    let dataHTML = "<tr><td>" + "UserID" + "<td><td>" + "Username" + "<tr><td>";
    for (let item of myJSONArray){
        dataHTML += "<tr><td>" + item.UserID + "<td><td>" + item.Username + "<tr><td>";
    }
    document.getElementById("UsersTable").innerHTML = dataHTML
}

function getUser() {
    console.log("Invoked getUser()");
    const UserID = document.getElementById("UserID").value;
    const url = "/users/get/";
    fetch(url + UserID, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            document.getElementById("DisplayOneUser").innerHTML = response.UserID + " " + response.Username;
        }
    });
}

function addUser() {
    console.log("Invoked AddUser()");
    //var tokengen = document.getElementById("token");
    //inttoken = Math.floor((Math.random() * 999999) + 1);
    //if (inttoken >= 100000){
    //    tokengen = "" + inttoken;
    //}else if(inttoken >= 10000){
    //    tokengen = "0" + inttoken;
    //}else if (inttoken >= 1000){
    //    tokengen = "00" + inttoken;
    //}else if (inttoken >= 100){
    //    tokengen = "000" + inttoken;
    //}else if (inttoken >= 10){
    //    tokengen = "0000" + inttoken;
    //}else{
    //    tokengen = "00000" + inttoken;
    //}
    //var x = 1;
    //while (x=1){
    const formData = new FormData(document.getElementById('InputUserDetails'));
    let url = "/users/add";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            window.open("/client/resources.html", "_self");
        }
    });
}

function login(){
    console.log("Invoked UsersLogin() ");
    let url = "/users/login";
    let formData = new FormData(document.getElementById('accountdetails'));
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            Cookies.set("Token", response.Token);
            Cookies.set("UserName", response.UserName);
            window.open("resources.html", "_self");
        }
    });

}



