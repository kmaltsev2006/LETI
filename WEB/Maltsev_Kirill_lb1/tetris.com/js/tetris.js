import { random, rotateMatrixClockwise } from "./utility.js";
import { getRandomTetraminoKey, TETROMINOES } from "./tetrominoes.js"

export const GRID_ROWS           = 20;
export const GRID_COLS           = 10;

export class Tetris {

    constructor() {
        this._grid = new Array(GRID_ROWS).fill().map(
            () => new Array(GRID_COLS).fill(null)
        );
        this.LEVEL_UP_ROWS_COUNT = 2;
        this._rows_cleared = 0;
        this._level = 0;
        this._game_over = false;
        this.genNextTetramino(true);
    }

    get game_over() { return this._game_over; }

    get grid() { return this._grid; }

    get tetramino() { return this._tetramino; }

    get next_tetramino_key() { return this._t_next_key; }

    get rows_cleared() { return this._rows_cleared; }

    get level() { return this._level; }

    isValid() {
        for (let i = 0; i < this._tetramino.size; ++i) {
            for (let j = 0; j < this._tetramino.size; ++j) {
                if (!this._tetramino.shape[i][j]) continue;
                let g_i = this._tetramino.i + i;
                let g_j = this._tetramino.j + j;
                if (this.isOutsizeOfTheGrid(g_i, g_j) || this.isColides(g_i, g_j)) return false;
            }
        }
        return true;
    }

    isOutsizeOfTheGrid(i, j) {
        return (i >= GRID_ROWS || j < 0 || j >= GRID_COLS);
    }

    isColides(i, j) {
        return this._grid[i][j];
    }
    
    moveDown() {
        ++this._tetramino.i;
        if (!this.isValid()) {
            --this._tetramino.i;
            this.placeTetramino();
        }
    }
    
    moveLeft() {
        --this._tetramino.j;
        if (!this.isValid()) {
            ++this._tetramino.j;
        }
    }
    
    moveRight() {
        ++this._tetramino.j;
        if (!this.isValid()) {
            --this._tetramino.j;
        }
    }

    rotateClockwise() {
        let tmp_shape = this._tetramino.shape;
        this._tetramino.shape = rotateMatrixClockwise(this._tetramino.shape);
        if (!this.isValid()) {
            this._tetramino.shape = tmp_shape;
        }
    }

    drop() {
        while (true) {
            ++this._tetramino.i;
            if (!this.isValid()) {
                --this._tetramino.i;
                this.placeTetramino();
                break;
            }
        }
    }

    genNextTetramino(init=false) {
        if (init) {
            this._t_key = getRandomTetraminoKey();
        } else {
            this._t_key = this._t_next_key;
        }

        this._t_next_key = getRandomTetraminoKey();
        this._tetramino = this.setupTetramino(this._t_key);

        if (!this.isValid()) {
            this._game_over = true;
        }
    }

    setupTetramino(t_key) {
        let tetramino = Object.create(TETROMINOES.get(t_key));
        tetramino.i = 0;
        tetramino.j = random(0, GRID_COLS - tetramino.size);
        return tetramino;
    }

    placeTetramino() {
        for (let i = 0; i < this._tetramino.size; ++i) {
            for (let j = 0; j < this._tetramino.size; ++j) {
                if (!this._tetramino.shape[i][j]) continue;
                let g_i = this._tetramino.i + i;
                let g_j = this._tetramino.j + j;
                this._grid[g_i][g_j] = this._t_key;
            }
        }

        this.processFilledRows();
        this.genNextTetramino();
    }

    processFilledRows() {
        let filled_rows = this.findFilledRows();
        this.removeFilledRows(filled_rows);
        this._rows_cleared += filled_rows.length;
        
        this._level = Math.floor(this._rows_cleared / this.LEVEL_UP_ROWS_COUNT);
    }

    findFilledRows() {
        let filled_rows = [];
        
        for (let i = 0; i < GRID_ROWS; ++i) {
            if (this._grid[i].every(cell => Boolean(cell))) {
                filled_rows.push(i);
            }      
        }

        return filled_rows;
    };

    removeFilledRows(filled_rows) {
        filled_rows.forEach(i => {
            this.dropRowsAbove(i);
        });
    }

    dropRowsAbove(i_to_remove) {
        for (let i = i_to_remove; i > 0; --i) {
            this._grid[i] = this._grid[i - 1];
        }
        this._grid[0] = new Array(GRID_COLS).fill(null);
    }
};