const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const wordsData = require('./words');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const rooms = new Map();

io.on('connection', (socket) => {
    socket.on('create-room', (userName) => {
        const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        rooms.set(roomId, {
            host: socket.id,
            players: [{ id: socket.id, name: userName, votes: 0 }],
            category: 'ogolna10',
            phase: 'lobby',
            word: '',
            impostorId: null
        });
        socket.join(roomId);
        socket.emit('room-created', roomId);
        io.to(roomId).emit('update-players', rooms.get(roomId).players);
    });

    socket.on('join-room', ({ roomId, userName }) => {
        const room = rooms.get(roomId.toUpperCase());
        if (room && room.players.length < 10 && room.phase === 'lobby') {
            room.players.push({ id: socket.id, name: userName, votes: 0 });
            socket.join(roomId.toUpperCase());
            io.to(roomId.toUpperCase()).emit('update-players', room.players);
            socket.emit('join-success', roomId.toUpperCase());
        } else {
            socket.emit('error-msg', 'Pokój nie istnieje lub jest pełny!');
        }
    });

    socket.on('start-game', ({ roomId, category }) => {
        const room = rooms.get(roomId);
        if (room && socket.id === room.host) {
            room.category = category;
            const catWords = wordsData[category];
            room.word = catWords[Math.floor(Math.random() * catWords.length)];
            const impIdx = Math.floor(Math.random() * room.players.length);
            room.impostorId = room.players[impIdx].id;
            room.phase = 'playing';
            io.to(roomId).emit('game-started', { impostorId: room.impostorId, word: room.word });
        }
    });

    socket.on('host-trigger-voting', (roomId) => {
        const room = rooms.get(roomId);
        if (room && socket.id === room.host) {
            io.to(roomId).emit('start-voting-now');
        }
    });

    socket.on('send-chat', ({ roomId, msg, name }) => {
        io.to(roomId).emit('receive-chat', { name, msg });
    });

    socket.on('cast-vote', ({ roomId, targetId }) => {
        const room = rooms.get(roomId);
        if (room) {
            const target = room.players.find(p => p.id === targetId);
            if (target) target.votes++;
            const totalVotes = room.players.reduce((sum, p) => sum + p.votes, 0);
            if (totalVotes === room.players.length) {
                const votedOut = room.players.reduce((p, c) => (p.votes > c.votes) ? p : c);
                const win = votedOut.id === room.impostorId ? 'CREW' : 'IMPOSTOR';
                io.to(roomId).emit('game-over', { win, impostorName: room.players.find(p => p.id === room.impostorId).name, word: room.word });
                room.players.forEach(p => p.votes = 0);
            }
        }
    });

    socket.on('new-game-request', (roomId) => {
        const room = rooms.get(roomId);
        if(room && socket.id === room.host) {
            room.phase = 'lobby';
            io.to(roomId).emit('back-to-lobby');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serwer na porcie ${PORT}`));
