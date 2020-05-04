// API ENDPOINTS
const crafatar_url = "https://crafatar.com/avatars/";
const players_api_endpoint = SERVER_ADDRESS + "/api/bans/players";
const playname_endpoint = SERVER_ADDRESS + "/api/users/";
const player_bans_endpoint = SERVER_ADDRESS + "/api/bans/player/";

// ELEMENT CONFIG
const tabbar_classes = "w3-bar-item w3-button tablink";

const openBar = function(evt, uuid) {
    var i, tablinks;
    
    fetchBans(uuid);

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-grey", "");
    }
    //document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " w3-grey";
}

const fetchPlayers = function(url) {
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let entries = data;
        return entries.map(function(entry) {
            console.log("[ENTRY]  ID: " + entry.id + ", UUID: " + entry.uuid);
            appendPlayer(entry);
        });
    }).catch(function(error) {
        console.error("[ERROR] Failed to load players from " + url + " (" + error + ")");
    });
}


const fetchBans = function(uuid) {
    let url = player_bans_endpoint + uuid;

    let main_panel = document.getElementById("main");
    main_panel.innerHTML = "";

    fetch(url)
    .then((resp) => resp.json())
    .then(function(bans) {
        bans.map(function(entry) {
            createAndAppendBan(entry, main_panel);
        });
    })
    .catch(function(error) {
        console.error("[ERROR] Failed to load ban from " + url + " (" + error + ")");
    })
}


const appendPlayer = function(player) {
    //let elements = document.getElementsByClassName("entry-card");
    appendPlayerToElement(player, document.getElementById("sidebar"));
}

const appendPlayerToElement = function(entry, element) {
    let btn = document.createElement("button");
    let icon = createCrafatarElement(entry.uuid, "sidebar-head");
    lookupUsername(entry.uuid, function(username) {
        btn.appendChild(icon);
        btn.classList.value = tabbar_classes;
        btn.innerHTML += username;

        btn.addEventListener("click", function(event) {
            openBar(event, entry.uuid);
        })

        element.appendChild(btn);
    });
}

const lookupUsername = function(uuid, callBack) {
    let url = playname_endpoint + uuid;
    var username;
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        console.log("[USER] Got username/uuid for " + uuid + " as " + data.username + " / " + data.uuid)
        callBack(data.username);
    }).catch(function(error) {
        console.error("[ERROR] Failed to load username from " + url + " (" + error + ")");
    });
}

const createCrafatarElement = function(uuid, cls) {
    let span = document.createElement("span");
    let img = document.createElement("img");
    img.src = crafatar_url + uuid + "?overlay";
    img.width = img.height = 32;
    span.classList.add(cls);
    span.appendChild(img);
    return span;
}

const createAndAppendBan = function(entry, main_panel) {

    const uuid = entry.player.uuid;
    const name = entry.player.name;

    const banned_by_name = entry.banner.name;

    const reason = entry.reason;

    let root = document.createElement("div");
    root.className = "w3-padding-16 page w3-container entry w3-animate-right";

    let ele = document.createElement("div");
    ele.className = "w3-card w3-padding-16 entry-card";

    let s = document.createElement("span");
    let img = document.createElement("img");
    img.src = crafatar_url + uuid + "?overlay"
    img.width = img.height = 64;
    s.classList = "card-content";
    s.appendChild(img);
    
    let span = document.createElement("span");
    span.innerHTML = name + " was banned for " + reason  + " by " + banned_by_name;
    span.className = "card-content";

    ele.appendChild(s);
    ele.appendChild(span);
    root.appendChild(ele);

    main_panel.appendChild(root);
}



fetchPlayers(players_api_endpoint);
