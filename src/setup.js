"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.randomPieceSetting = exports.initialiseSettings = exports.createNullBoard = void 0;
const Pieces_1 = require("./Pieces");
const Game_1 = require("./Game");
const defaultNumRow = 9;
const defaultNumCol = 7;
const defaultPieceOrder = ['elephant', 'wolf', 'panther', 'rat', 'cat', 'dog', 'tiger', 'lion'];
const defaultPiecePosition = [[6, 0], [6, 2], [6, 4], [6, 6], [7, 1], [7, 5], [8, 0], [8, 6]];
const defaultPlayerOneTraps = [[8, 2], [8, 4], [7, 3]];
const defaultPlayerOneDen = [[8, 3]];
const defaultRiver = [[3, 1], [3, 2], [4, 1], [4, 2], [5, 1], [5, 2], [3, 4], [3, 5], [4, 4], [4, 5], [5, 4], [5, 5]];
function createNullBoard(numOfRow, numOfCol) {
    return new Array(numOfRow).fill(null).map(() => new Array(numOfCol).fill(null));
}
exports.createNullBoard = createNullBoard;
function initialiseBoard(numOfRow, numOfCol, pieceOrder, piecePosition) {
    let board = createNullBoard(numOfRow, numOfCol);
    for (let i = 0; i < piecePosition.length; i++) {
        board[piecePosition[i][0]][piecePosition[i][1]] = pieceOrder[i] + '0';
        board[numOfRow - 1 - piecePosition[i][0]][numOfCol - 1 - piecePosition[i][1]] = pieceOrder[i] + '1';
    }
    return board;
}
let reflectPosition = (numOfRow, numOfCol, [row, col]) => ([numOfRow - 1 - row, numOfCol - 1 - col]);
const initialiseTraps = (numOfRow, numOfCol, onePlayerTraps) => ({
    0: onePlayerTraps,
    1: onePlayerTraps.map(reflectPosition.bind(null, numOfRow, numOfCol))
});
const initialiseDen = (numOfRow, numOfCol, onePlayerDen) => ({
    0: onePlayerDen,
    1: onePlayerDen.map(reflectPosition.bind(null, numOfRow, numOfCol))
});
const initialiseRiver = (river) => river;
const initialiseNumRow = (numRow) => numRow;
const initialiseNumCol = (numCol) => numCol;
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
    let numOfRow = initialiseNumRow(numRow);
    let numOfCol = initialiseNumCol(numCol);
    let board = initialiseBoard(numOfRow, numOfCol, pieceOrder, piecePosition);
    let traps = initialiseTraps(numOfRow, numOfCol, playerOneTraps);
    let dens = initialiseDen(numOfRow, numOfCol, playerOneDen);
    let rivers = initialiseRiver(river);
    return {
        numOfRow: numOfRow,
        numOfCol: numOfCol,
        cells: Object.assign([], board),
        traps: traps,
        dens: dens,
        rivers: rivers,
        selectedPiece: null,
        selectedRow: null,
        selectedCol: null,
        pieces: Object.assign({}, JSON.parse(JSON.stringify(Pieces_1.Pieces))),
        possibleMovesLookUp: (0, Game_1.computePossibleMoves)(board, numOfRow, numOfCol, rivers, dens, Object.assign({}, JSON.parse(JSON.stringify(Pieces_1.Pieces)))),
        transposition: {},
    };
}
exports.initialiseSettings = initialiseSettings;
function randomPieceSetting() {
    let pieceOrder = shuffleArray(defaultPieceOrder);
    initialiseSettings(undefined, undefined, pieceOrder);
}
exports.randomPieceSetting = randomPieceSetting;
function setup() {
    return initialiseSettings();
}
exports.setup = setup;
