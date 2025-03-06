import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Character from "../public/character.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    players[socket.id] = new Character(socket.id, 100, 400);

    socket.emit('currentPlayers', Object.values(players).map(p => p.serialize()));
    socket.broadcast.emit('newPlayer', players[socket.id].serialize());

    socket.on('move', (direction) => {
        if (players[socket.id]) {
            players[socket.id].move(direction);
            players[socket.id].update(); // Update player position
            io.emit('updatePlayer', players[socket.id].serialize()); // Sync with clients
        }
    });

    socket.on('attack', () => {
        if (players[socket.id]) {
            players[socket.id].attack();
            io.emit('updatePlayer', players[socket.id].serialize());
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('removePlayer', socket.id);
    });
});

httpServer.listen(5000, () => {
    console.log("Server running on port 5000");
});
