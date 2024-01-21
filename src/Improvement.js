"use strict";
// Make random moves to check distribution of scores
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardEvaluation = void 0;
const Game_1 = require("./Game");
const setup_1 = require("./setup");
const react_plotly_js_1 = __importDefault(require("react-plotly.js"));
const react_1 = __importDefault(require("react"));
const computeDistance = ([row, col], target) => Math.abs(target[0] - row) + Math.abs(target[1] - col);
const pieceValues = {
    'elephantWithoutRat': 10,
    'elephantWithRat': 8,
    'lion': 8,
    'tiger': 8,
    'panther': 5,
    'wolf': 4,
    'dog': 3,
    'cat': 2,
    'rat': 2,
};
const distanceValue = (distance) => {
    switch (distance) {
        // case 0:
        //     return 1000
        case 1:
            return 10;
        case 2:
            return 5;
        case 3:
            return 3;
        case 4:
            return 2;
        default:
            return 1;
    }
};
function locatePieces(board, playerID) {
    let pieceCoordinates = {};
    let enemyRatPresent = false;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            let piece = board[row][col];
            if (piece !== null) {
                if (piece.slice(-1) === playerID) {
                    pieceCoordinates[piece.slice(0, -1)] = [row, col];
                }
                else if (piece.slice(0, -1) === 'rat')
                    enemyRatPresent = true;
            }
        }
    }
    if ('elephant' in pieceCoordinates) {
        if (enemyRatPresent)
            pieceCoordinates['elephantWithRat'] = pieceCoordinates['elephant'];
        else
            pieceCoordinates['elephantWithoutRat'] = pieceCoordinates['elephant'];
        delete pieceCoordinates.elephant;
    }
    return pieceCoordinates;
}
function boardEvaluation(board, playerID, dens) {
    let friendlyPieceCoordinates = locatePieces(board, String(1 - parseInt(playerID)));
    let friendlyDenCoordinates = dens[1 - parseInt(playerID)][0];
    let enemyPieceCoordinates = locatePieces(board, playerID);
    let enemyDenCoordinates = dens[parseInt(playerID)][0];
    return Object.entries(friendlyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece] * distanceValue(computeDistance(coordinate, enemyDenCoordinates))).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0) - Object.entries(enemyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece] * distanceValue(computeDistance(coordinate, friendlyDenCoordinates))).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
}
exports.boardEvaluation = boardEvaluation;
function computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, playerID) {
    const movesArray = [];
    for (let row = 0; row < numOfRow; row++) {
        for (let col = 0; col < numOfCol; col++) {
            let piece = board[row][col];
            if (piece && piece.slice(-1) === playerID) {
                (0, Game_1.getPossibleMoves)(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [row, col]).forEach(destination => movesArray.push([[row, col], destination]));
            }
        }
    }
    return movesArray;
}
function botAction(G, botPlayerNumber) {
    let moves = computeFriendlyPossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces, botPlayerNumber);
    let move = moves[Math.floor(Math.random() * moves.length)];
    let [initialRow, initialCol] = move[0];
    let [destinationRow, destinationCol] = move[1];
    let selectedPiece = G.cells[initialRow][initialCol];
    G.cells[destinationRow][destinationCol] = selectedPiece;
    G.cells[initialRow][initialCol] = null;
    if ((0, Game_1.isEnemyTrap)(G.traps, parseInt(botPlayerNumber), [destinationRow, destinationCol])) {
        G.pieces[selectedPiece].value = -1;
    }
    else {
        G.pieces[selectedPiece].value = G.pieces[selectedPiece].defaultValue;
    }
}
function hasPieceRemain(board, numOfROw, numOfCol, player) {
    for (let i = 0; i < numOfROw; i++) {
        for (let j = 0; j < numOfCol; j++) {
            if (board[i][j]) { // @ts-ignore
                if (board[i][j].slice(-1) === player)
                    return true;
            }
        }
    }
    return false;
}
function MyPlot() {
    let data = {};
    for (let i = 0; i < 100; i++) {
        let G = (0, setup_1.initialiseSettings)();
        while (Object.values(G.dens).flat().some(a => (G.cells[a[0]][a[1]] === null)) && (hasPieceRemain(G.cells, G.numOfRow, G.numOfCol, '0'))) {
            botAction(G, '0');
            let value = boardEvaluation(G.cells, '0', G.dens);
            if (value in data)
                data[value] += 1;
            else
                data[value] = 1;
            if (!hasPieceRemain(G.cells, G.numOfRow, G.numOfCol, '1'))
                break;
            botAction(G, '1');
        }
    }
    return react_1.default.createElement("div", null,
        react_1.default.createElement(react_plotly_js_1.default, { data: [
                {
                    x: Object.keys(data),
                    y: Object.values(data),
                    type: 'bar',
                }
            ], layout: { width: 1500, title: 'A Fancy Plot', yaxis: { range: [0, 1000] } } }));
}
// yaxis:{range:[0,100]}
// layout={ {autosize:true, title: 'A Fancy Plot' }}
exports.default = MyPlot;
