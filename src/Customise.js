"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomPieceSetting = exports.initialiseSettings = exports.createNullBoard = exports.TERRAIN = exports.RIVER = exports.DENS = exports.TRAPS = exports.BOARD = exports.NUMOFCOL = exports.NUMOFROW = void 0;
let defaultNumRow = 9;
let defaultNumCol = 7;
let defaultPieceOrder = ['elephant', 'wolf', 'panther', 'rat', 'cat', 'dog', 'tiger', 'lion'];
let defaultPiecePosition = [[6, 0], [6, 2], [6, 4], [6, 6], [7, 1], [7, 5], [8, 0], [8, 6]];
let defaultPlayerOneTraps = [[8, 2], [8, 4], [7, 3]];
let defaultPlayerOneDen = [[8, 3]];
let defaultRiver = [[3, 1], [3, 2], [4, 1], [4, 2], [5, 1], [5, 2], [3, 4], [3, 5], [4, 4], [4, 5], [5, 4], [5, 5]];
function createNullBoard() {
    return new Array(exports.NUMOFROW).fill(null).map(() => new Array(exports.NUMOFCOL).fill(null));
}
exports.createNullBoard = createNullBoard;
function initialiseBoard(pieceOrder, piecePosition) {
    let board = createNullBoard();
    for (let i = 0; i < piecePosition.length; i++) {
        board[piecePosition[i][0]][piecePosition[i][1]] = pieceOrder[i] + '0';
        board[exports.NUMOFROW - 1 - piecePosition[i][0]][exports.NUMOFCOL - 1 - piecePosition[i][1]] = pieceOrder[i] + '1';
    }
    return board;
}
function initialiseTerrain() {
    let board = createNullBoard();
    exports.RIVER.forEach(([row, col]) => board[row][col] = 'river');
    exports.TRAPS[0].forEach(([row, col]) => board[row][col] = 'trap0');
    exports.TRAPS[1].forEach(([row, col]) => board[row][col] = 'trap1');
    exports.DENS[0].forEach(([row, col]) => board[row][col] = 'den0');
    exports.DENS[1].forEach(([row, col]) => board[row][col] = 'den1');
    return board;
}
let reflectPosition = ([row, col]) => ([exports.NUMOFROW - 1 - row, exports.NUMOFCOL - 1 - col]);
function initialiseTraps(onePlayerTraps) {
    return ({
        0: onePlayerTraps,
        1: onePlayerTraps.map(reflectPosition)
    });
}
function initialiseDen(onePlayerDen) {
    return ({
        0: onePlayerDen,
        1: onePlayerDen.map(reflectPosition)
    });
}
function initialiseRiver(river) {
    return river;
}
function initialiseNumRow(numRow) { return numRow; }
function initialiseNumCol(numCol) { return numCol; }
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function initialiseSettings(numRow = defaultNumRow, numCol = defaultNumCol, pieceOrder = defaultPieceOrder, piecePosition = defaultPiecePosition, playerOneTraps = defaultPlayerOneTraps, playerOneDen = defaultPlayerOneDen, river = defaultRiver) {
    exports.NUMOFROW = initialiseNumRow(numRow);
    exports.NUMOFCOL = initialiseNumCol(numCol);
    exports.BOARD = initialiseBoard(pieceOrder, piecePosition);
    exports.TRAPS = initialiseTraps(playerOneTraps);
    exports.DENS = initialiseDen(playerOneDen);
    exports.RIVER = initialiseRiver(river);
    exports.TERRAIN = initialiseTerrain();
}
exports.initialiseSettings = initialiseSettings;
function randomPieceSetting() {
    let pieceOrder = shuffleArray(defaultPieceOrder);
    initialiseSettings(undefined, undefined, pieceOrder);
}
exports.randomPieceSetting = randomPieceSetting;
