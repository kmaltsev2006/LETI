document.getElementById('username').value = localStorage.getItem('tetrisUsername') || '';

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    localStorage.setItem('tetrisUsername', username);
    window.location.href = 'game.html';
});