import { GRID_ROWS, GRID_COLS } from "./tetris.js";
import { TETROMINOES } from "./tetrominoes.js";

const BACKGROUND_COLOR = 'black'

export class View {
    
    constructor() {
        this._game_grid = new Array(GRID_ROWS).fill().map(
            () => new Array(GRID_COLS).fill(BACKGROUND_COLOR)
        );
        this._next_piece_grid = new Array(4).fill().map(
            () => new Array(4).fill(BACKGROUND_COLOR)
        );

        this._level = 1;
        this._game = document.getElementById('game').getContext('2d');
        this._t_height = document.getElementById('game').height / GRID_ROWS;
        this._t_width = document.getElementById('game').width / GRID_COLS;

        this._next_piece = document.getElementById('next-piece').getContext('2d');
        this._next_t_height = document.getElementById('next-piece').height / 4;
        this._next_t_width = document.getElementById('next-piece').width / 4;
    }

    set level(level) { this._level = level; }

    clear() {
        for (let i = 0; i < GRID_ROWS; ++i) {
            for (let j = 0; j < GRID_COLS; ++j) {
                this._game_grid[i][j] = BACKGROUND_COLOR;
            }
        }

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                this._next_piece_grid[i][j] = BACKGROUND_COLOR;
            }
        }
    }

    draw(grid, tetramino, next_tetramino_key) {
        this.clear();

        for (let i = 0; i < GRID_ROWS; ++i) {
            for (let j = 0; j < GRID_COLS; ++j) {
                if (!grid[i][j]) continue;
                this._game_grid[i][j] = TETROMINOES.get(grid[i][j]).color;
            }
        }

        for (let i = 0; i < tetramino.size; ++i) {
            for (let j = 0; j < tetramino.size; ++j) {
                if (!tetramino.shape[i][j]) continue;
                let grid_i = tetramino.i + i;
                let grid_j = tetramino.j + j;
                this._game_grid[grid_i][grid_j] = tetramino.color;
            }
        }

        let next_tetramino = TETROMINOES.get(next_tetramino_key);
        for (let i = 0; i < next_tetramino.size; ++i) {
            for (let j = 0; j < next_tetramino.size; ++j) {
                if (!next_tetramino.shape[i][j]) continue;
                this._next_piece_grid[i][j] = next_tetramino.color;
            }
        }
    }

    show() {
        for (let i = 0; i < GRID_ROWS; ++i) {
            for (let j = 0; j < GRID_COLS; ++j) {
                this._game.fillStyle = this._game_grid[i][j];

                this._game.fillRect(
                    j * this._t_width,
                    i * this._t_height,
                    this._t_width,
                    this._t_height
                );

                this._game.strokeStyle = BACKGROUND_COLOR;
                this._game.lineWidth = 1;
                this._game.strokeRect(
                    j * this._t_width,
                    i * this._t_height,
                    this._t_width,
                    this._t_height
                );
            }
        }

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                this._next_piece.fillStyle = this._next_piece_grid[i][j];

                this._next_piece.fillRect(
                    j * this._t_width,
                    i * this._t_height,
                    this._t_width,
                    this._t_height
                );

                this._next_piece.strokeStyle = BACKGROUND_COLOR;
                this._next_piece.lineWidth = 1;
                this._next_piece.strokeRect(
                    j * this._t_width,
                    i * this._t_height,
                    this._t_width,
                    this._t_height
                );
            }
        }
    }
};