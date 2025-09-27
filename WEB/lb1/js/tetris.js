import { random, rotateMatrixClockwise } from "./utility.js";
import { getRandomTetramino } from "./tetrominoes.js"

export const GRID_ROWS = 20;
export const GRID_COLS = 10;


class Tetris {

    constructor(canvas) {
        this._canvas = canvas;
        this.init()
    }

    init() {
        this._grid = new Array(GRID_ROWS).fill().map(
            () => new Array(GRID_COLS).fill(0)
        );
        this._next_tetramino = this.genNextTetramino();
    }

    start() {
        this._curr_tetramino = this._curr_tetramino;
    }

    gameOver() {
        return false;
    }

    isValid() {
        for (let i = 0; i < this._curr_tetramino.size; ++i) {
            for (let j = 0; j < this._curr_tetramino.size; ++j) {
                if (!this._curr_tetramino.shape[i][j]) continue;
                let grid_i = this._curr_tetramino.i + i;
                let grid_j = this._curr_tetramino.j + j;
                if (this.isOutsizeOfTheGrid(grid_i, grid_j) || isColides(i, j)) return false;
            }
        }
        return true;
    }

    isOutsizeOfTheGrid(i, j) {
        return (i >= GRID_ROWS || j < 0 || j > GRID_COLS);
    }

    isColides(i, j) {
        if (i < 0) return true;
        return this._grid[i][j];
    }
    
    moveDown() {
        ++this._curr_tetramino.i;
        if (!this.isValid()) {
            --this._curr_tetramino.i;
            this.placeTetramino();
        }
    }
    
    moveLeft() {
        --this._curr_tetramino.j;
        if (!this.isValid()) {
            ++this._curr_tetramino.j;
        }
    }
    
    moveRight() {
        ++this._curr_tetramino.j;
        if (!this.isValid()) {
            --this._curr_tetramino.j;
        }
    }

    rotateClockwise() {
        let tmp_shape = this._curr_tetramino.shape;
        this._curr_tetramino.shape = rotateMatrixClockwise(this._curr_tetramino);
        if (!this.isValid()) {
            this._curr_tetramino = tmp_shape;
        }
    }

    genNextTetramino() {
        let tetramino = getRandomTetramino();
        tetramino.i = 0;
        tetramino.j = random(0, GRID_COLS - tetramino.size);
        return tetramino;
    }

    placeTetramino() {
        for (let i = 0; i < this._curr_tetramino.size; ++i) {
            for (let j = 0; j < this._curr_tetramino.size; ++j) {
                if (this._curr_tetramino.shape[i][j]) continue;
                this._grid[i][j] = 1;
                this._canvas.grid[i][j] = this._curr_tetramino.color;
            }
        }

        this._curr_tetramino = this._next_tetramino;
        this._next_tetramino = this.genNextTetramino();
    }
};