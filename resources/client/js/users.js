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
    if(document.getElementById('password').value === document.getElementById('checkpassword').value){
        if (((document.getElementById('password').value).length >= 5) && ((document.getElementById('password').value).length <=15)){
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
                    let url = "/users/login";
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
            });
        }else{
            alert("Password must be between 5 and 15 characters long");
        }

    }else{
        console.log("Passwords don't match");
        alert("Passwords don't match");
    }
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

function logout() {
    debugger;
    console.log("Invoked logout");
    let url = "/users/logout";
    fetch(url, {method: "POST"
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            Cookies.remove("Token", response.Token);
            Cookies.remove("Username", response.Username);
            window.open("index.html", "_self");
        }
    });
}

function showResources(){
    console.log("Invoked showResources()");
    const url = "/resources/list/";
    fetch(url, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatResourcesList(response);
        }
    });
}

function formatResourcesList(myJSONArray){
    let dataHTML = "<tr><td>" + "SongName" + "<td><td>" + "ArtistName" + "<tr><td>";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.SongName + "<td><td>" + item.ArtistName + "<tr><td>";
    }
    document.getElementById("ResourceTable").innerHTML = dataHTML;
}


