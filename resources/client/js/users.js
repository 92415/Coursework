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
            window.open("/client/welcome.html", "_self");
        }
    });
}



