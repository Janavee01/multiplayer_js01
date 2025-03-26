import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Character from "../public/character.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(express.static("public"));
const PORT = 5000;

let players = {};
let connectedPlayers = 0;

io.on("connection", (socket) => {
    if (connectedPlayers >= 2) {
        console.log(`Rejected connection: ${socket.id}, server is full.`);
        socket.emit("connectionRejected", { message: "Server is full. Try again later." });
        socket.disconnect(true);
        return;
    }

    console.log(`Player connected: ${socket.id}`);
    
     if (connectedPlayers === 0) {
        players[socket.id] = new Character(socket.id, 100, 400);
        players[socket.id].color = "darkblue";
     }
    else if (connectedPlayers === 1) {
        players[socket.id] = new Character(socket.id, 900, 400);
        players[socket.id].color = "red";
    }
    console.log(`Player ${socket.id} assigned color: ${players[socket.id].color}`);
    connectedPlayers++;

    socket.emit('currentPlayers', Object.values(players).map(p => p.serialize()));
    socket.broadcast.emit('newPlayer', players[socket.id].serialize());

    socket.on('move', (direction) => {
        if (players[socket.id]) {
            players[socket.id].move(direction);
            players[socket.id].update(); 
            io.emit('updatePlayer', players[socket.id].serialize()); 
        }
    });

    socket.on('attack', () => {
        if (players[socket.id]){
            players[socket.id].attack();
            io.emit('updatePlayer', players[socket.id].serialize());
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        connectedPlayers--;
        io.emit('removePlayer', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
