import { random } from "./utility.js"

class Tetromino {
    constructor(color, shape) {
        this._color = color;
        this._shape = shape;
        this._size = shape.length;
    }

    get color() { return this._color; }

    get shape() { return this._shape; }

    get size() { return this._size; }
};

export const TETROMINOES = new Map ([
    ['I', new Tetromino('black',
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    )],
    ['J', new Tetromino('black',
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ]
    )],
    ['L', new Tetromino('black',
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ]
    )],
    ['O', new Tetromino('black',
        [
            [1, 1],
            [1, 1],
        ]
    )],
    ['S', new Tetromino('black',
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ]
    )],
    ['Z', new Tetromino('black',
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ]
    )],
    ['T', new Tetromino('black',
        [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ]
    )]
]);

let tetraminoes_keys = Array.from(TETROMINOES.keys());

export function getRandomTetramino() {
    let key = tetraminoes_keys[random(0, TETROMINOES.size - 1)];
    return TETROMINOES.get(key);
}