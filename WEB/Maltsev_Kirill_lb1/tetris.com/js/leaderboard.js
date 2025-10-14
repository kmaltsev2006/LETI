function createLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '{}');
    let sorted = [];

    for (let user in leaderboard) {
        sorted.push([user, leaderboard[user]]);
    }

    sorted.sort((a, b) => b[1] - a[1]);

    let html = '';
    for (let i = 0; i < sorted.length; i++) {
        html += '<p>' + (i + 1) + '. ' + sorted[i][0] + ': ' + sorted[i][1] + '</p>';
    }

    document.getElementById('leaderboard').innerHTML = html;
}

createLeaderboard();