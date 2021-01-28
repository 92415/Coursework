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
            window.open("resources.html?0", "_self");
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
    const order = location.search.substring(1);
    console.log("Invoked showResources()");
    const url = "/resources/list/";
    fetch(url + order, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatResourcesList(response, order);
        }
    });
}

function formatResourcesList(myJSONArray, order){
    if (order === "0"){
        document.getElementById('tabletop').innerHTML = "<th>Song <button type='button' onclick='resourcePage(1)'>↑</button></th> <th>Artist <button type='button' onclick='resourcePage(2)'>↓</button></th> <th>Feature</th> <th>Delete</th>"
    }else if (order === "1"){
        document.getElementById('tabletop').innerHTML = "<th>Song <button type='button' onclick='resourcePage(0)'>↓</button></th> <th>Artist <button type='button' onclick='resourcePage(2)'>↓</button></th> <th>Feature</th> <th>Delete</th>"
    }else if (order === "2"){
        document.getElementById('tabletop').innerHTML = "<th>Song <button type='button' onclick='resourcePage(0)'>↓</button></th> <th>Artist <button type='button' onclick='resourcePage(3)'>↑</button></th> <th>Feature</th> <th>Delete</th>"
    }else{
        document.getElementById('tabletop').innerHTML = "<th>Song <button type='button' onclick='resourcePage(0)'>↓</button></th> <th>Artist <button type='button' onclick='resourcePage(2)'>↓</button></th> <th>Feature</th> <th>Delete</th>"
    }
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

function resourcePage(num){
    let url = "resources.html?" + num;
    window.open(url, "_self");
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
            window.open("resources.html?0","_self");
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
    console.log("Invoked removePlaylist");
    const url = "/playlists/delete/";
    fetch(url + playlistID, {
        method: "POST",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            window.open("playlist.html","_self");
        }
    });
}

function newPlaylist(){
    window.open("addPlaylist.html", "_self");
}

function addPlaylist(){
    let description = document.getElementById("description").value;
    let name = document.getElementById("playlistName").value;
    if (name.length >= 1){
        if (name.length < 30){
            if (description.length < 50){
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
                alert("Description must be less than 50 characters long");
            }
        }
        else{
            alert("Playlist name must be less than 30 characters long");
        }
    }
    else{
        console.log("Playlist name not entered");
        alert("Playlist name not entered");
    }
}

function showSongs(){
    let playlistID = location.search.substring(1);
    document.getElementById('addSong').innerHTML = "<button type='button' id='" + playlistID + "' onclick='linkSong(this.id)'>Add Songs</button>";
    console.log("Invoked showSongs");
    const url1 = "/playlists/detail/";
    fetch(url1 + playlistID, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatPlaylistDetails(response, playlistID);
        }
    });
    const url2= "/playlisttransfer/list/";
    fetch(url2 + playlistID, {
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

function formatPlaylistDetails(myJSONArray, playlistID){
    for (let item of myJSONArray){
        let playlistName = item.PlaylistName;
        let description = item.Description;
        document.getElementById('playlistName').innerHTML = playlistName;
        document.getElementById('playlistDescription').innerHTML = description;
        document.getElementById('edit').innerHTML = "<button type='button' id='" + playlistID + "' onclick='linkEditPlaylist(this.id)'>Edit Name</button>"
    }
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

function linkEditPlaylist(playlistID){
    let url = "editPlaylist.html?" + playlistID;
    window.open(url, "_self")
}

function linkSong(playlistID){
    let url = "addSong.html?" + playlistID;
    window.open(url, "_self");
}

function showUnowned(){
    const playlistID = location.search.substring(1);
    document.getElementById('back').innerHTML = "<button type='button' id='" + playlistID + "' onclick='openPlaylist(this.id)'>Back</button>";
    const url = "/playlisttransfer/unowned/";
    fetch(url + playlistID, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatAddingList(response, playlistID);
        }
    });
}

function formatAddingList(myJSONArray, playlistID){
    let dataHTML;
    for (let item of myJSONArray) {
        dataHTML = "";
        let songID = item.SongID;
        let songName = item.SongName;
        let artistName = item.ArtistName;
        let featureName = item.FeatureName;
        dataHTML += "<tr><td>" + songName + "<td>" + artistName + "<td>" + featureName + "<td>" + "<input type='button' id='" + songID + "' value = 'Add' name='" + playlistID + "' onclick='addSong(this.id, this.name)'>"  + "<tr><td>";
        document.getElementById('unownedTable').innerHTML += dataHTML;
    }
}

function addSong(songID, playlistID){
    console.log("Invoked addSong");
    const formData = new FormData();
    formData.append("SongID", songID);
    formData.append("PlaylistID", playlistID);
    const url = "/playlisttransfer/add/";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            let url = "addSong.html?" + playlistID;
            window.open(url,"_self");
        }
    });
}

function playlistDetail(){
    const playlistID = location.search.substring(1);
    console.log("Invoked playlistDetail");
    const url1 = "/playlists/detail/";
    fetch(url1 + playlistID, {
        method: "GET",
    }).then(response => {
        return response.json();
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            formatPlaylistEdit(response);
        }
    });
}

function formatPlaylistEdit(myJSONArray){
    let dataHTML;
    for (let item of myJSONArray){
        dataHTML = "";
        let playlistName = item.PlaylistName;
        let description = item.Description;
        dataHTML = "Name: <input type='text' name='PlaylistName' id='newPlaylistName' value='" + playlistName + "'><br><br> Description:<br><textarea type='text' name='Description' id='newDescription'>" + description + "</textarea><br>";
        document.getElementById('updatedPlaylistDetails').innerHTML = dataHTML;
        document.getElementById('updateButton').innerHTML = "<button onclick=\"cancelEdit()\">Cancel</button> <button id='" + playlistName + "' name='" + description + "' onclick='updatePlaylist(this.id, this.name)'>Change details</button>";
    }
}

function cancelEdit(){
    const playlistID = location.search.substring(1);
    let url = "openPlaylist.html?" + playlistID;
    window.open(url, "_self");
}

function updatePlaylist(playlistName, description){
    let newDescription = document.getElementById("newDescription").value;
    let newPlaylistName = document.getElementById("newPlaylistName").value;
    if (newDescription === ""){
        newDescription = description;
    }
    if (newPlaylistName === ""){
        newPlaylistName = playlistName;
    }
    const playlistID = location.search.substring(1);
    const formData = new FormData();
    if (newPlaylistName.length < 30){
        if (newDescription.length < 50){
            formData.append("PlaylistID", playlistID);
            formData.append("PlaylistName", newPlaylistName);
            formData.append("Description", newDescription);
            let url1 = "/playlists/update";
            fetch(url1, {
                method: "POST",
                body: formData,
            }).then(response => {
                return response.json()
            }).then(response => {
                if (response.hasOwnProperty("Error")) {
                    alert(JSON.stringify(response));
                } else {
                    let url2 = "openPlaylist.html?" + playlistID;
                    window.open(url2, "_self");
                }
            });
        }
        else{
            alert("Description must be less than 50 characters long");
        }
    }
    else{
        alert("Playlist name must be less than 30 characters long");
    }
}
