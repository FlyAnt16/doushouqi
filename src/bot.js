"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botAction = exports.boardEvaluation = void 0;
const Game_1 = require("./Game");
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
let timeToMove = 0;
let timeInEvaluation = 0;
let timeInComputeMove = 0;
let numOfNode = 0;
const computeDistance = ([row, col], target) => Math.abs(target[0] - row) + Math.abs(target[1] - col);
const distanceValue = (distance) => {
    switch (distance) {
        case 0:
            return 1000;
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
    let startTime = performance.now();
    let friendlyPieceCoordinates = locatePieces(board, String(1 - parseInt(playerID)));
    let friendlyDenCoordinates = dens[1 - parseInt(playerID)][0];
    let enemyPieceCoordinates = locatePieces(board, playerID);
    let enemyDenCoordinates = dens[parseInt(playerID)][0];
    let value = Object.entries(friendlyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece] * distanceValue(computeDistance(coordinate, enemyDenCoordinates))).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0) - Object.entries(enemyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece] * distanceValue(computeDistance(coordinate, friendlyDenCoordinates))).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
    let endTime = performance.now();
    timeInEvaluation += endTime - startTime;
    return value;
}
exports.boardEvaluation = boardEvaluation;
function makeMove(board, [initialRow, initialCol], pieces, [destinationRow, destinationCol], traps, playerID) {
    let boardCopy = structuredClone(JSON.parse(JSON.stringify(board)));
    let piecesCopy = structuredClone(JSON.parse(JSON.stringify(pieces)));
    let selectedPiece = board[initialRow][initialCol];
    boardCopy[destinationRow][destinationCol] = selectedPiece;
    boardCopy[initialRow][initialCol] = null;
    if ((0, Game_1.isEnemyTrap)(traps, parseInt(playerID), [destinationRow, destinationCol])) {
        piecesCopy[selectedPiece].value = -1;
    }
    else {
        piecesCopy[selectedPiece].value = piecesCopy[selectedPiece].defaultValue;
    }
    return [boardCopy, piecesCopy];
}
function computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, playerID) {
    let startTime = performance.now();
    const movesArray = [];
    for (let row = 0; row < numOfRow; row++) {
        for (let col = 0; col < numOfCol; col++) {
            let piece = board[row][col];
            if (piece && piece.slice(-1) === playerID) {
                (0, Game_1.getPossibleMoves)(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [row, col]).forEach(destination => movesArray.push([[row, col], destination]));
            }
        }
    }
    let endTime = performance.now();
    timeInComputeMove += endTime - startTime;
    return movesArray;
}
// assume bot is player 1 and user is player 0
function findBestMove(G, botPlayerNumber) {
    // if (boardToString(G.cells, G.numOfRow, G.numOfCol) in G.transposition) return G.transposition[boardToString(G.cells, G.numOfRow, G.numOfCol)]
    let moves = computeFriendlyPossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces, botPlayerNumber);
    let bestMove = -1000000;
    let bestMoveFound = moves[0];
    for (const move of moves) {
        let value = minimax(1, 5, false, -100000, 100000, makeMove(G.cells, move[0], G.pieces, move[1], G.traps, botPlayerNumber), G.numOfRow, G.numOfCol, G.rivers, G.dens, G.traps);
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = move;
        }
    }
    return bestMoveFound;
}
function minimax(currentDepth, maxDepth, isMax, alpha, beta, [board, pieces], numOfRow, numOfCol, rivers, dens, traps) {
    numOfNode += 1;
    let currentPlayer;
    if (isMax)
        currentPlayer = '1';
    else
        currentPlayer = '0';
    if (currentDepth === maxDepth) {
        return boardEvaluation(board, currentPlayer, dens);
    }
    let moves = computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, currentPlayer);
    if (isMax) {
        let bestMove = -100000;
        for (let i = 0; i < moves.length; i++) {
            bestMove = Math.max(bestMove, minimax(currentDepth + 1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps));
            alpha = Math.max(bestMove, alpha);
            if (beta <= alpha)
                break;
        }
        return bestMove;
    }
    else {
        let bestMove = 100000;
        for (let i = 0; i < moves.length; i++) {
            bestMove = Math.min(bestMove, minimax(currentDepth + 1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps));
            beta = Math.min(bestMove, beta);
            if (beta <= alpha)
                break;
        }
        return bestMove;
    }
}
function botAction(G, botPlayerNumber) {
    let startTime = performance.now();
    timeInEvaluation = 0;
    timeInComputeMove = 0;
    numOfNode = 0;
    let move = findBestMove(G, botPlayerNumber);
    // G.transposition[boardToString(G.cells,G.numOfRow, G.numOfCol)] = move
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
    let endTime = performance.now();
    console.log('total time:', endTime - startTime);
    console.log('time in evaluation:', timeInEvaluation);
    console.log('time in compute move:', timeInComputeMove);
    console.log('number of nodes searched:', numOfNode);
}
exports.botAction = botAction;
function pieceToDigit(piece) {
    switch (piece) {
        case 'elephant':
            return '9';
        case 'lion':
            return '8';
        case 'tiger':
            return '7';
        case 'panther':
            return '6';
        case 'wolf':
            return '5';
        case 'dog':
            return '4';
        case 'cat':
            return '3';
        case 'rat':
            return '2';
    }
}
function boardToString(board, numOfRow, numOfCol) {
    let boardString = '';
    for (let row = 0; row < numOfRow; row++) {
        for (let col = 0; col < numOfCol; col++) {
            let piece = board[row][col];
            if (piece)
                boardString = boardString + pieceToDigit(piece.slice(0, -1)) + piece.slice(-1);
            else
                boardString = boardString + '00';
        }
    }
    return boardString;
}
//
// let board = [
//     [null, null, null],
//     ['rat1', null, null],
//     ['elephant0', null, 'lion0']
// ]
// console.log(boardToString(board,3,3))
// let dens = {1:[[0,1]], 0:[[1,1]]}
// let result = locatePieces(board, '0')
// class Piece{
//     readonly defaultValue : number;
//     value : number;
//     readonly canEnterRiver : boolean;
//     readonly canCrossRiver : boolean;
//     readonly playerNumber : number
//
//     constructor(value:number, canEnterRiver:boolean, canCrossRiver:boolean, playerNumber:number) {
//         this.defaultValue = value;
//         this.value = value;
//         this.canEnterRiver = canEnterRiver;
//         this.canCrossRiver = canCrossRiver;
//         this.playerNumber = playerNumber;
//     }
// }
//
// const pieces:PiecesType = {
//     'elephant0' : new Piece(7,false, false, 0),
//     'lion0' : new Piece(6, false, true, 0),
//     'tiger0' : new Piece(5,false, true, 0),
//     'panther0' : new Piece(4, false, false, 0),
//     'wolf0' : new Piece(3, false, false, 0),
//     'dog0' : new Piece(2, false, false, 0),
//     'cat0' : new Piece(1, false, false, 0),
//     'rat0' : new Piece(0, true, false, 0),
//     'elephant1' : new Piece(7,false, false, 1),
//     'lion1' : new Piece(6, false, true, 1),
//     'tiger1' : new Piece(5,false, true, 1),
//     'panther1' : new Piece(4, false, false, 1),
//     'wolf1' : new Piece(3, false, false, 1),
//     'dog1' : new Piece(2, false, false, 1),
//     'cat1' : new Piece(1, false, false, 1),
//     'rat1' : new Piece(0, true, false, 1)
// }
// console.log(result)
// console.log(result['pieceCoordinate'])
// console.log(computeFriendlyPossibleMoves(board, 3,3,[[0,0]],dens, pieces, '0'))
