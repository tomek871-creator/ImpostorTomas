const socket = io();
let myName = "";
let currentRoom = "";

function createRoom() {
    myName = document.getElementById('username').value;
    if(!myName) return alert("Podaj imię!");
    socket.emit('create-room', myName);
}

function joinRoom() {
    myName = document.getElementById('username').value;
    currentRoom = document.getElementById('roomCode').value.toUpperCase();
    if(!myName || !currentRoom) return alert("Podaj dane!");
    socket.emit('join-room', { roomId: currentRoom, userName: myName });
}

socket.on('room-created', (code) => {
    currentRoom = code;
    showScreen('lobby-screen');
    document.getElementById('displayCode').innerText = code;
});

socket.on('join-success', (code) => {
    showScreen('lobby-screen');
    document.getElementById('displayCode').innerText = code;
    document.getElementById('start-btn').classList.add('hidden');
});

socket.on('update-players', (players) => {
    const list = document.getElementById('player-list');
    list.innerHTML = players.map(p => `<div>👤 ${p.name}</div>`).join('');
});

function startGame() {
    socket.emit('start-game', currentRoom);
}

socket.on('game-started', ({ impostorId, word }) => {
    showScreen('game-screen');
    const display = document.getElementById('the-word');
    if (socket.id === impostorId) {
        display.innerText = "JESTEŚ IMPOSTOREM!";
        display.className = "impostor-text";
    } else {
        display.innerText = word;
    }
    
    // Timer 2 minuty
    let timeLeft = 120;
    const timerInt = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Czas: ${timeLeft}s`;
        if(timeLeft <= 0) {
            clearInterval(timerInt);
            showVoting();
        }
    }, 1000);
});

function sendMsg() {
    const msg = document.getElementById('chat-msg').value;
    if(msg) {
        socket.emit('send-chat', { roomId: currentRoom, msg, name: myName });
        document.getElementById('chat-msg').value = "";
    }
}

socket.on('receive-chat', ({ name, msg }) => {
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div class="msg"><b>${name}:</b> ${msg}</div>`;
    box.scrollTop = box.scrollHeight;
});

function showVoting() {
    document.getElementById('voting-area').classList.remove('hidden');
    socket.emit('request-players-vote', currentRoom);
}

socket.on('game-over', ({ win, impostorName, word }) => {
    showScreen('result-screen');
    document.getElementById('winner-text').innerText = win === 'CREW' ? "ZAŁOGA WYGRAŁA! 🎉" : "IMPOSTOR WYGRAŁ! 😈";
    document.getElementById('reveal-word').innerText = word;
    document.getElementById('reveal-impostor').innerText = impostorName;
});

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function copyCode() {
    navigator.clipboard.writeText(currentRoom);
    alert("Kod skopiowany!");
}
