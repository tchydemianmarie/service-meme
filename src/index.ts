const express = require('express');
const crypto_server = require("crypto");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent') // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
const PORT = 8088;

const ROOM = [];

app.use(express.static('src/client'));

// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile('src/client/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {

    socket.emit("room", ROOM);

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
        console.log('a user connected');
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

    socket.on('mouse_activity', function (data) {
        socket.broadcast.in(data.room).emit('all_mouse_activity', {session_id: socket.id, coords: data.coords});
    });

    socket.on('mouse_click', function (data) {
        socket.broadcast.emit('mouse_click', {session_id: socket.id, cords: data});
    });

    socket.on('create', function () {
        let roomName = generateID()
        socket.join(roomName);
        ROOM.push(roomName);
        socket.broadcast.emit("room", ROOM);
        socket.emit("create", roomName)
    });
    socket.on('join_room', function (room) {
        socket.join(room);
        socket.broadcast.in(room).emit("room_joined", "Bienvenue dans la room : " + room)
    });

    socket.on("host", function (data) {
        socket.to(data.room).emit("host", data);
    });

});
//server.listen(8087);


app.get('/hello', function (req, res) { // création de la route sous le verbe get
    res.send(jsonData) // envoi de hello world a l'utilisateur
})


app.listen(PORT, () => { // ecoute du serveur sur le port 8087
    console.log('le serveur fonctionne')
})

// ---host 0.0.0.0


function generateID() {
    return crypto_server.randomBytes(3 * 4).toString('base64');
}

let jsonData = [{color: "red", value: "#f00"}, {color: "green", value: "#0f0"}, {color: "blue", value: "#00f"}, {color: "cyan", value: "#0ff"}, {color: "magenta", value: "#f0f"}, {color: "yellow", value: "#ff0"}, {color: "black", value: "#000"}]