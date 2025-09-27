import { Tetris } from "./tetris.js";
import { View } from "./view.js";

class App {
    constructor() {
        this._tetris = new Tetris();
        this._view = new View();
        this.onKeydown = this.onKeydown.bind(this);
        this.init();
        this.initKeyDown();
    }

    init() {
        this._view.show();
        this.updateView();
        let intervalId = setInterval(() => {
        if (this._tetris.game_over) {
            clearInterval(intervalId);
        } else {
            this._tetris.moveDown();
            this.updateView();
        }
        }, 1000);
    }

    initKeyDown() {
        document.addEventListener('keydown', this.onKeydown);
    }

    onKeydown(event) {
        if (this._tetris.game_over) return;

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
            default:
                return;
        }
        this.updateView();        
    }

    updateView() {
        this._view.draw(this._tetris.grid, this._tetris.tetramino, this._tetris.next_tetramino_key);
        this._view.level = this._tetris.level;
        this._view.show();
    }
};

let app = new App();