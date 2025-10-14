import { random } from "./utility.js"

export class Tetromino {
    constructor(color, shape) {
        this._color = color;
        this._shape = shape;
        this._size = shape.length;
    }

    get color() { return this._color; }

    get shape() { return this._shape; }

    get size() { return this._size; }

    set shape(shape) { this._shape = shape; }
};

export const TETROMINOES = new Map ([
    ['I', new Tetromino('cyan',
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    )],
    ['J', new Tetromino('blue',
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ]
    )],
    ['L', new Tetromino('orange',
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ]
    )],
    ['O', new Tetromino('yellow',
        [
            [1, 1],
            [1, 1],
        ]
    )],
    ['S', new Tetromino('green',
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ]
    )],
    ['Z', new Tetromino('red',
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ]
    )],
    ['T', new Tetromino('purple',
        [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ]
    )]
]);

let tetraminoes_keys = Array.from(TETROMINOES.keys());

export function getRandomTetraminoKey() {
    return tetraminoes_keys[random(0, TETROMINOES.size - 1)];
}