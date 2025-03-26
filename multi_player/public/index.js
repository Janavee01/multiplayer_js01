import Character from "./character.js";

const socket = io('ws://localhost:5000');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;

const bgimg = new Image();
bgimg.src = 'https://i.pinimg.com/736x/d1/48/4d/d1484dae779822c963b264fab4790f1e.jpg';
bgimg.onload = () => c.drawImage(bgimg, 0, 0, canvas.width, canvas.height);

// const player = new Character(socket.id, 100, 400);
let characters = {};

socket.on('currentPlayers', (players) => {
    characters = {};
    console.log("Received players:", players);
    players.forEach(player => {
        console.log(`Player ${player.id} - Position: (${player.x}, ${player.y}), Color: ${player.color}`);
        characters[player.id] = new Character(player.id, player.x, player.y, player.color);
    });
    drawPlayers();
});

socket.on("newPlayer", (player) => {
    console.log(`New player joined: ${player.id}, Color: ${player.color}`);

    let playerElement = document.createElement("div");
    playerElement.id = player.id;
    playerElement.style.width = "50px";
    playerElement.style.height = "50px";
    playerElement.style.backgroundColor = player.color;
    playerElement.style.position = "absolute";
    playerElement.style.left = player.x + "px";
    playerElement.style.top = player.y + "px";

    document.body.appendChild(playerElement);
});

socket.on('updatePlayer', (player) => {
    if (characters[player.id]) {
        characters[player.id].x = player.x;
        characters[player.id].y = player.y;
        drawPlayers();
    }
});

socket.on('removePlayer', (id) => {
    delete characters[id];
    drawPlayers();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") socket.emit("move", "left");
    if (event.key === "ArrowRight") socket.emit("move", "right");
    if (event.key === "ArrowUp") socket.emit("move", "up");
    if (event.key === "ArrowDown") socket.emit("move", "down");
    if (event.key === " ") socket.emit("attack"); // Spacebar for attack
});

document.addEventListener("keyup", () => {
    socket.emit("move", "stop");
});

function drawPlayers() {
    c.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
    c.drawImage(bgimg, 0, 0, canvas.width, canvas.height); // Redraw background

    for (let id in characters) {
        characters[id].draw(c);
    }
}

function gameLoop() {
    drawPlayers();
    requestAnimationFrame(gameLoop); // Loop to update the game screen
}

socket.on('connect', () => {
    console.log("connected socket id", socket.id);
});

socket.on("connectionRejected",(data) => {
    alert(data.message);
    socket.disconnect();
});

gameLoop();
