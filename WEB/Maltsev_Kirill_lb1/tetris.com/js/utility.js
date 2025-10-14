export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function rotateMatrixClockwise(martix) {
    let new_matrix = new Array(martix.length).fill().map(
        () => new Array(martix.length)
    );

    for (let i = 0; i < martix.length; ++i) {
        for (let j = 0; j < martix.length; ++j) {
            new_matrix[i][j] = martix[martix.length - j - 1][i];
        }
    }
    
    return new_matrix;
}