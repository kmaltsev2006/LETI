import { Tetris } from "./tetris.js";
import { View } from "./view.js";

class App {
    constructor() {
        this.MAX_DROP_INTERVAL_MS     = 1000;
        this.MIN_DROP_INTERVAL_MS     = 500;
        this.SPEED_INCREASE_PER_LEVEL = 50;
        
        this._tetris = new Tetris();
        this._view = new View();
        this._drop_interval_ms = this.MAX_DROP_INTERVAL_MS;
        this._current_level = this._tetris.level;
        this.onKeydown = this.onKeydown.bind(this);
        this.initKeydown();
    }

    init() {
        this.updateView();
        this._view.show();
        this.startGameLoop();
    }

    initKeydown() {
        document.addEventListener('keydown', this.onKeydown);
    }

    onKeydown(event) {
        if (this._tetris.game_over) { return; }

        switch (event.key) {
            case 'ArrowDown':
                this._tetris.moveDown();
                break;
            case 'ArrowLeft':
                this._tetris.moveLeft();
                break;
            case 'ArrowRight':
                this._tetris.moveRight();
                break;
            case 'ArrowUp':
                this._tetris.rotateClockwise();
                break;
            case ' ':
                this._tetris.drop();
                break;
            default:
                return;
        }
        this.updateView();
    }

    updateView() {
        this.updateSpeed();

        this._view.rows_cleared = this._tetris.rows_cleared;
        this._view.level = this._tetris.level;
        this._view.speed = this._drop_interval_ms;
        this._view.draw(this._tetris.grid, this._tetris.tetramino, this._tetris.next_tetramino_key);
        this._view.show();
    }

    updateSpeed() {
        if (this._current_level != this._tetris.level) {
            this._current_level = this._tetris.level;
            this._drop_interval_ms = Math.max(
                this.MAX_DROP_INTERVAL_MS - this._current_level * this.SPEED_INCREASE_PER_LEVEL,
                this.MIN_DROP_INTERVAL_MS
            );
            this.restartGameLoop();
        }
    }

    startGameLoop() {
        this.interval_id = setInterval(() => {
            if (this._tetris.game_over) {
                clearInterval(this.interval_id);
                this.saveScore();
                window.location.href = 'leaderboard.html';
            } else {
                this._tetris.moveDown();
                this.updateView();
            }
        }, this._drop_interval_ms);
    }

    restartGameLoop() {
        clearInterval(this.interval_id);
        this.startGameLoop();
    }

    saveScore() {
        let username = localStorage.getItem('tetrisUsername');
        let score = this._tetris.rows_cleared;
        
        let leaderboard = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '{}');
        if (!leaderboard[username] || score > leaderboard[username]) {
            leaderboard[username] = score;
            localStorage.setItem('tetrisLeaderboard', JSON.stringify(leaderboard));
        }
    }
}

let app = new App();
app.init();