//All Javascipt functions related to Users
function addUser() {
    let password = document.getElementById('password').value;
    let checkPassword = document.getElementById('checkPassword').value;
    let username = document.getElementById('username').value;
    if(password === checkPassword) {
        if (lengthCheck(password) && lengthCheck(username)) {
            if (spaceCheck(password) && spaceCheck(username)) {
                const formData = new FormData(document.getElementById('inputUserDetails'));
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
                        loginAPI(formData);
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

function lengthCheck(logins){
    return (logins.length <= 15 && logins.length >= 5);
}

function login(){
    let formData = new FormData(document.getElementById('accountDetails'));
    loginAPI(formData);
}

function loginAPI(formData){
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
    let i;
    let spaces = 0;
    for (i = 0; i < logins.length; i++){
        if (logins.charAt(i) === ' '){
            spaces = spaces + 1;
        }
    }
    return spaces === 0;
}

//All Javascript functions that relates to resources
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
    let dataHTML;
    for (let item of myJSONArray) {
        dataHTML = "";
        let songID = item.SongID;
        let songName = item.SongName;
        let artistName = item.ArtistName;
        let featureName = item.FeatureName;
        dataHTML += "<tr><td>" + songName + "<td>" + artistName + "<td>" + featureName + "<td>" + "<input type='button' id='" + songID + "' value = 'Delete' onclick='removeResource(this.id)'>"  + "<tr><td>";
        document.getElementById('resourceTable').innerHTML += dataHTML;
    }
}

function removeResource(songID){
    console.log("Invoked removeResource");
    const url = "/resources/delete/";
    fetch(url + songID, {
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

function addResource(songID){
    console.log("Invoked addResource");
    const url = "/resources/add/";
    fetch(url + songID, {
        method: "POST",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            location.reload();
        }
    });
}

//All Javascript functions that relate to libraries
function showLibrary(){
    const genre = location.search.substring(1);
    console.log("Invoked showLibrary");
    const url = "/libraries/list/";
    fetch(url + genre, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatLibraryList(response);
        }
    });
}

function formatLibraryList(myJSONArray){
    let dataHTML;
    for (let item of myJSONArray) {
        dataHTML = "";
        let songID = item.SongID;
        let songName = item.SongName;
        let artistName = item.ArtistName;
        let featureName = item.FeatureName;
        dataHTML += "<tr><td>" + songName + "<td>" + artistName + "<td>" + featureName + "<td>" + "<input type='button' id='" + songID + "' value = 'Add' onclick='addResource(this.id)'>"  + "<tr><td>";
        document.getElementById('libraryTable').innerHTML += dataHTML;
    }

}



//All Javascript functions that relate to search
function search(){
    let url = "results.html?" + document.getElementById('searcher').value;
    window.open(url, "_self");
}

function showSearch(){
    let searcher = location.search.substring(1);
    if (searcher === null){
        searcher = "";
    }
    console.log("Invoked showSearch");
    const url = "/libraries/search/";
    fetch(url + searcher, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatSearchList(response);
        }
    });
}

function formatSearchList(myJSONArray){
    let dataHTML;
    for (let item of myJSONArray) {
        dataHTML = "";
        let songID = item.SongID;
        let songName = item.SongName;
        let artistName = item.ArtistName;
        let featureName = item.FeatureName;
        dataHTML += "<tr><td>" + songName + "<td>" + artistName + "<td>" + featureName + "<td>" + "<input type='button' id='" + songID + "' value = 'Add' onclick='addResource(this.id)'>"  + "<tr><td>";
        document.getElementById('searchTable').innerHTML += dataHTML;
    }
}

//All Javascript functions that relate to playlists
function showPlaylist(){
    console.log("Invoked showPlaylist()");
    const url = "/playlists/list/";
    fetch(url, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatPlaylistList(response);
        }
    });
}

function formatPlaylistList(myJSONArray){
    let dataHTML;
    for (let item of myJSONArray) {
        dataHTML = "";
        let playlistID = item.PlaylistID;
        let playlistName = item.PlaylistName;
        dataHTML += "<tr><td>" + "<input type='button' id='" + playlistID + "' value = '" + playlistName + "' onclick='openPlaylist(this.id)'>" + "<td>" + "<input type='button' id='" + playlistID + "' value = 'Delete' onclick='removePlaylist(this.id)'>" + "<tr><td>";
        document.getElementById('playlistTable').innerHTML += dataHTML;
    }
}

function openPlaylist(playlistID){
    let url = "openPlaylist.html?" + playlistID;
    window.open(url, "_self")
}

function removePlaylist(playlistID){
    alert(playlistID);

}

function newPlaylist(){
    window.open("addPlaylist.html", "_self");
}

function addPlaylist(){
    let description = document.getElementById("description").value;
    let name = document.getElementById("playlistName").value;
    if (name.length >= 1){
        if (name.length <= 40){
            if (description.length <= 150){
                const formData = new FormData(document.getElementById('inputPlaylistDetails'));
                let url = "/playlists/add";
                fetch(url, {
                    method: "POST",
                    body: formData,
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.hasOwnProperty("Error")) {
                        alert(JSON.stringify(response));
                    } else {
                        window.open("playlist.html", "_self");
                    }
                });
            }
            else{
                alert("Description must be less that 80 characters long");
            }
        }
        else{
            alert("Playlist name must be less that 40 characters long");
        }
    }
    else{
        console.log("Playlist name not entered");
        alert("Playlist name not entered");
    }
}

function showSongs(){
    let playlistID = location.search.substring(1);
    console.log("Invoked showSongs");
    const url = "/playlisttransfer/list/";
    fetch(url + playlistID, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatSongsList(response, playlistID);
        }
    });
}

function formatSongsList(myJSONArray, playlistID){
    let dataHTML;
    for (let item of myJSONArray) {
        dataHTML = "";
        let songID = item.SongID;
        let songName = item.SongName;
        let artistName = item.ArtistName;
        let featureName = item.FeatureName;
        dataHTML += "<tr><td>" + songName + "<td>" + artistName + "<td>" + featureName + "<td>" + "<input type='button' id='" + songID + "' value = 'Delete' name='" + playlistID + "' onclick='removeSong(this.id, this.name)'>"  + "<tr><td>";
        document.getElementById('songTable').innerHTML += dataHTML;
    }
}

function removeSong(songID, playlistID){
    console.log("Invoked removeSong");
    const formData = new FormData();
    formData.append("SongID", songID);
    formData.append("PlaylistID", playlistID);
    const url = "/playlisttransfer/delete/";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            let url = "openPlaylist.html?" + playlistID;
            window.open(url,"_self");
        }
    });
}

function addSong(){
}