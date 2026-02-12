const socket = io();
let myName = "", currentRoom = "", isHost = false;

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (document.activeElement.id === 'chat-msg') sendMsg();
        else if (document.activeElement.id === 'username') createRoom();
    }
});

function createRoom() {
    myName = document.getElementById('username').value;
    if(myName) socket.emit('create-room', myName);
}

function joinRoom() {
    myName = document.getElementById('username').value;
    currentRoom = document.getElementById('roomCode').value;
    if(myName && currentRoom) socket.emit('join-room', { roomId: currentRoom, userName: myName });
}

socket.on('room-created', (code) => {
    currentRoom = code; isHost = true;
    showScreen('lobby-screen');
    document.getElementById('displayCode').innerText = code;
    document.getElementById('host-controls').classList.remove('hidden');
    document.getElementById('wait-msg').classList.add('hidden');
});

socket.on('join-success', (code) => {
    currentRoom = code; showScreen('lobby-screen');
    document.getElementById('displayCode').innerText = code;
});

socket.on('update-players', (players) => {
    document.getElementById('player-list').innerHTML = players.map(p => `<div>👤 ${p.name}</div>`).join('');
    document.getElementById('vote-buttons').innerHTML = players
        .filter(p => p.id !== socket.id)
        .map(p => `<button onclick="castVote('${p.id}')">${p.name}</button>`).join('');
});

function startGame() {
    const cat = document.getElementById('category-select').value;
    socket.emit('start-game', { roomId: currentRoom, category: cat });
}

function triggerVoting() { socket.emit('host-trigger-voting', currentRoom); }

socket.on('game-started', ({ impostorId, word }) => {
    showScreen('game-screen');
    document.getElementById('voting-area').classList.add('hidden');
    if (isHost) document.getElementById('host-game-controls').classList.remove('hidden');
    document.getElementById('the-word').innerText = (socket.id === impostorId) ? "JESTEŚ IMPOSTOREM!" : word;
});

socket.on('start-voting-now', () => {
    document.getElementById('voting-area').classList.remove('hidden');
    document.getElementById('host-game-controls').classList.add('hidden');
});

function sendMsg() {
    const input = document.getElementById('chat-msg');
    if(input.value) {
        socket.emit('send-chat', { roomId: currentRoom, msg: input.value, name: myName });
        input.value = "";
    }
}

socket.on('receive-chat', ({ name, msg }) => {
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div><b>${name}:</b> ${msg}</div>`;
    box.scrollTop = box.scrollHeight;
});

function castVote(targetId) {
    socket.emit('cast-vote', { roomId: currentRoom, targetId });
    document.getElementById('vote-buttons').innerHTML = "Czekanie...";
}

socket.on('game-over', ({ win, impostorName, word }) => {
    showScreen('result-screen');
    document.getElementById('winner-text').innerText = win === 'CREW' ? "ZAŁOGA WYGRAŁA!" : "IMPOSTOR WYGRAŁ!";
    document.getElementById('reveal-word').innerText = word;
    document.getElementById('reveal-impostor').innerText = impostorName;
    if(isHost) document.getElementById('host-restart').classList.remove('hidden');
});

function restartGame() { socket.emit('new-game-request', currentRoom); }
socket.on('back-to-lobby', () => { showScreen('lobby-screen'); });

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
