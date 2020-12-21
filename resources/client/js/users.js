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
    if(document.getElementById('password').value === document.getElementById('checkpassword').value){
        if ((((document.getElementById('password').value).length >= 5) && ((document.getElementById('password').value).length <=15))&&(((document.getElementById('username').value).length >=5)&&((document.getElementById('username').value).length <=15))) {
            if (spaceCheck(document.getElementById('password').value) && spaceCheck(document.getElementById('username').value)){
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
                alert("Username and password must not contain spaces");
            }
        }else{
            alert("Username and password must be between 5 and 15 characters long");
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

function spaceCheck(logins){
    var i;
    var spaces = 0;
    for (i = 0; i < logins.length; i++){
        if (logins.charAt(i) === ' '){
            spaces = spaces + 1;
        }
    }
    return spaces === 0;
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
    let dataHTML = "";
    for (let item of myJSONArray) {
        songname = item.SongName;
        artistname = item.ArtistName;
        featurename = item.FeatureName;
        dataHTML += "<tr><td>" + songname + "<td>" + artistname + "<td>" + featurename + "<td>" + "<button type='button' onclick='removeResource(songname)'>" + "Delete</button>" + "<tr><td>";
    }
    document.getElementById("ResourceTable").innerHTML = dataHTML;
}

function removeResource(Name){
    console.log("Invoked removeResource");
    const url = "/resources/delete/";
    const SongName = Name;
    fetch(url + SongName, {
        method: "POST",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            window.open("resources.html","_self");
        }
    });
}

function showlibrary(){
    genre = location.search.substring(1);
}




