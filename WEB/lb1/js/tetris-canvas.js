import { GRID_ROWS, GRID_COLS } from "./tetris.js";

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const BACKGROUND_COLOR = 'black'

let colors = ['red', 'green', 'black'];

class Canvas {
    
    constructor() {
        this._grid = new Array(GRID_ROWS).fill().map(
            () => new Array(GRID_COLS).fill(BACKGROUND_COLOR)
        );
        this._canvas = document.querySelector('canvas').getContext('2d');
        this._with = document.querySelector('canvas').width
        this._height = document.querySelector('canvas').height
    }

    get grid() {
        return this._grid;
    }

    drawGrid() {
        for (let i = 0; i < GRID_ROWS; ++i) {
            for (let j = 0; j < GRID_COLS; ++j) {
                this._canvas.fillStyle = colors[random(0, 2) % 3];
                let size = this._height / GRID_ROWS;
                this._canvas.fillRect(j * size, i * size, (j + 1) * size, (i + 1) * size);
            }
        }
    }

};

let canvas = new Canvas();
canvas.drawGrid();