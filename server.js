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
            players: [{ id: socket.id, name: userName, votes: 0, wins: 0, isImpostorCount: 0 }],
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
        const room = rooms.get(roomId);
        if (room && room.players.length < 10 && room.phase === 'lobby') {
            room.players.push({ id: socket.id, name: userName, votes: 0, wins: 0, isImpostorCount: 0 });
            socket.join(roomId);
            io.to(roomId).emit('update-players', room.players);
            socket.emit('join-success', roomId);
        } else {
            socket.emit('error-msg', 'Pokój nie istnieje lub jest pełny!');
        }
    });

    socket.on('start-game', (roomId) => {
        const room = rooms.get(roomId);
        if (room && room.players.length >= 3) {
            const categoryWords = wordsData[room.category];
            room.word = categoryWords[Math.floor(Math.random() * categoryWords.length)];
            const impostorIdx = Math.floor(Math.random() * room.players.length);
            room.impostorId = room.players[impostorIdx].id;
            room.players[impostorIdx].isImpostorCount++;
            room.phase = 'playing';
            
            io.to(roomId).emit('game-started', {
                impostorId: room.impostorId,
                word: room.word
            });
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
                const votedOut = room.players.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
                const win = votedOut.id === room.impostorId ? 'CREW' : 'IMPOSTOR';
                
                room.phase = 'reveal';
                io.to(roomId).emit('game-over', { win, impostorName: room.players.find(p => p.id === room.impostorId).name, word: room.word });
                // Reset głosów
                room.players.forEach(p => p.votes = 0);
            }
        }
    });
});

server.listen(3000, () => console.log('Serwer działa na porcie 3000'));

