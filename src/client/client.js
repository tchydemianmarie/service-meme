// Connexion à socket.io
const sharescreen = document.getElementById("sharescreen");
const socket = io.connect();
let ROOM = document.getElementById("mySelect");

//event.offsetX*2 offset pour recuperé la position par rapport a la div et * 2 car on divise la taille de l'ecran par 2 donc on reviens a la meme echelle
//
sharescreen.addEventListener('mousemove', function (event) { // Event appelé lors du changement de position de la souris sur la DIV
    console.log("event.offsetX", event.offsetX);
    console.log("event.offsetY", event.offsetY);
    socket.emit('mouse_activity', {room: ROOM, coords: {x: event.offsetX * 2, y: event.offsetY * 2}});
});

sharescreen.addEventListener("click", function (event) { // Event appelé lorsque l'utilisateur utiise le click gauche de sa souris
    console.log("event click", event);
    socket.emit('mouse_click', {x: event.offsetX * 2, y: event.offsetY * 2})
});
sharescreen.addEventListener('touchstart', function (event) { // Event appelé lorsque l'utilisateur utiise un apppareil tactile
    console.log("event touchstart", event)
    const touch = event.changedTouches[0];
    let startX = parseInt(touch.clientX) * 2;
    let startY = parseInt(touch.clientY) * 2;
    console.log("event start done", startX, startY)
    socket.emit('mouse_click', {x: startX, y: startY})
}, false);


socket.on('mouse_click', function (data) {
    console.log(data);
});


socket.on("room", function (room) {
    console.log("All room : ", room);
    choseRoom(room);
})

socket.on("room_joined", function (param) {
    console.log("room_joined", param);
})


socket.on("host", function (screenSize) {
    sharescreen.style.height = (screenSize.height / 2) + "px";
    sharescreen.style.width = (screenSize.width / 2) + "px";

});

function choseRoom(roomTab) {

    var select = document.getElementById("mySelect");
    select.innerHTML = "";
    var optionNull = document.createElement("option");
    optionNull.text = "rooms";
    optionNull.value = null;
    select.options.add(optionNull);
    for (let i = 0; i < roomTab.length; i++) {
        var newOption = document.createElement("option");
        newOption.text = "room " + (i + 1);
        newOption.value = roomTab[i];
        select.options.add(newOption)
    }


}

function joinRoom(roomSelected) { // Fonction qui permet de rejoindre une ROOM et de garder en memoire la room selectionné
    ROOM = roomSelected;
    socket.emit("join_room", roomSelected);
}

document.getElementById("mySelect").addEventListener("change", function(e) {
    console.log(joinRoom(roomSelected).value) // ici tu appelle joinRoom avec comme parametre la value
})

function addition(nb1, nb2){
    return nb1 + nb2;
    
}

var result = addition(2,5);
console.log(result);