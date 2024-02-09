"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePossibleMoves = exports.getPossibleMoves = exports.isEnemyTrap = exports.DouSHouQiSinglePlayer = exports.DouSHouQi = void 0;
const setup_1 = require("./setup");
const bot_1 = require("./bot");
exports.DouSHouQi = {
    name: 'dou-shou-qi',
    setup: setup_1.setup,
    moves: {
        onClick: ({ G, playerID, events }, row, col) => {
            let selected = G.cells[row][col];
            if (selected && (G.pieces[selected].playerNumber === parseInt(playerID))) {
                selectFriendlyPiece(G, row, col);
            }
            else if (G.selectedPiece && (G.selectedRow !== null) && (G.selectedCol !== null)) {
                let possibleMoves = G.possibleMovesLookUp[G.selectedPiece];
                if (possibleMoves.some(a => (a[0] === row && a[1] === col))) {
                    makeMove(G, row, col);
                    events.endTurn();
                }
            }
        }
    },
    endIf: ({ G, ctx }) => {
        if (Object.values(G.dens).flat().some(a => (G.cells[a[0]][a[1]] !== null))) {
            return { winner: ctx.currentPlayer };
        }
    },
};
exports.DouSHouQiSinglePlayer = {
    setup: setup_1.setup,
    moves: {
        onClick: ({ G, playerID, events }, row, col) => {
            let selected = G.cells[row][col];
            if (selected && (G.pieces[selected].playerNumber === parseInt(playerID))) {
                selectFriendlyPiece(G, row, col);
            }
            else if (G.selectedPiece && (G.selectedRow !== null) && (G.selectedCol !== null)) {
                let possibleMoves = G.possibleMovesLookUp[G.selectedPiece];
                if (possibleMoves.some(a => (a[0] === row && a[1] === col))) {
                    makeMove(G, row, col);
                    events.endTurn();
                    if (Object.values(G.dens).flat().some(a => (G.cells[a[0]][a[1]] !== null)))
                        events.endTurn();
                    else
                        (0, bot_1.botAction)(G, '1');
                    G.possibleMovesLookUp = computePossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces);
                }
            }
        }
    },
    endIf: ({ G, ctx }) => {
        if (Object.values(G.dens).flat().some(a => (G.cells[a[0]][a[1]] !== null))) {
            return { winner: ctx.currentPlayer };
        }
    },
};
function selectFriendlyPiece(G, row, col) {
    G.selectedPiece = G.cells[row][col];
    G.selectedRow = row;
    G.selectedCol = col;
}
function makeMove(G, row, col) {
    if ((G.selectedRow !== null) && (G.selectedCol !== null) && G.selectedPiece) {
        G.cells[row][col] = G.selectedPiece;
        G.cells[G.selectedRow][G.selectedCol] = null;
        if ((0, exports.isEnemyTrap)(G.traps, G.pieces[G.selectedPiece].playerNumber, [row, col])) {
            G.pieces[G.selectedPiece].value = -1;
        }
        else {
            G.pieces[G.selectedPiece].value = G.pieces[G.selectedPiece].defaultValue;
        }
        G.selectedPiece = null;
        G.selectedRow = null;
        G.selectedCol = null;
        G.possibleMovesLookUp = computePossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces);
    }
}
const isEnemyTrap = (traps, playerNumber, [row, col]) => traps[1 - playerNumber].some(a => (a[0] === row && a[1] === col));
exports.isEnemyTrap = isEnemyTrap;
const isRiver = (rivers, [row, col]) => rivers.some(a => (a[0] === row && a[1] === col));
const isFriendlyDen = (dens, pieces, piece, [row, col]) => dens[pieces[piece].playerNumber].some(a => (a[0] === row && a[1] === col));
const firstPieceCanCaptureSecondPiece = (pieces, piece1, piece2) => pieces[piece1].playerNumber !== pieces[piece2].playerNumber && ((pieces[piece1].value === 0 && pieces[piece2].value === 7) || (!(pieces[piece1].value === 7 && pieces[piece2].value === 0) && pieces[piece1].value >= pieces[piece2].value));
// {if (pieces[piece1].playerNumber!==pieces[piece2].playerNumber){
//     if (pieces[piece1].value===0 && pieces[piece2].value===7){
//         return true
//     } else{
//         if (pieces[piece1].value===7 && pieces[piece2].value===0){
//             return false
//         } else {
//             return pieces[piece1].value>=pieces[piece2].value
//         }
//     }
// }
// return false}
const checkValidSquare = (board, pieces, piece, [row, col]) => board[row][col] === null || firstPieceCanCaptureSecondPiece(pieces, piece, board[row][col]);
// {
//     if (board[row][col] !== null){
//         return firstPieceCanCaptureSecondPiece(pieces, piece, board[row][col] as string)
// }
// return true
// }
function getReachableInOneDirection(board, rivers, dens, pieces, piece, [row, col], [rowChange, colChange]) {
    if (!isRiver(rivers, [row + rowChange, col + colChange])) {
        if (!isFriendlyDen(dens, pieces, piece, [row + rowChange, col + colChange])) {
            return [row + rowChange, col + colChange];
        }
    }
    else {
        if (pieces[piece].canEnterRiver) {
            return [row + rowChange, col + colChange];
        }
        else {
            if (pieces[piece].canCrossRiver) {
                let endRow = row + rowChange;
                let endCol = col + colChange;
                let blocked = false;
                while (isRiver(rivers, [endRow, endCol])) {
                    if (board[endRow][endCol] !== null) {
                        blocked = true;
                        break;
                    }
                    endRow += rowChange;
                    endCol += colChange;
                }
                if (!blocked) {
                    return [endRow, endCol];
                }
            }
        }
    }
    return null;
}
function getReachableSquares(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [row, col]) {
    let reachableSquares = [];
    if (row > 0) {
        let reachableSquare = getReachableInOneDirection(board, rivers, dens, pieces, piece, [row, col], [-1, 0]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    if (row < numOfRow - 1) {
        let reachableSquare = getReachableInOneDirection(board, rivers, dens, pieces, piece, [row, col], [1, 0]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    if (col > 0) {
        let reachableSquare = getReachableInOneDirection(board, rivers, dens, pieces, piece, [row, col], [0, -1]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    if (col < numOfCol - 1) {
        let reachableSquare = getReachableInOneDirection(board, rivers, dens, pieces, piece, [row, col], [0, 1]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    return reachableSquares;
}
function getPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [selectedRow, selectedCol]) {
    let possibleMoves = [];
    let reachableSquares = getReachableSquares(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [selectedRow, selectedCol]);
    reachableSquares.forEach(([row, col]) => { if (checkValidSquare(board, pieces, piece, [row, col]))
        possibleMoves.push([row, col]); });
    return possibleMoves;
}
exports.getPossibleMoves = getPossibleMoves;
function computePossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces) {
    const movesObject = {};
    for (let row = 0; row < numOfRow; row++) {
        for (let col = 0; col < numOfCol; col++) {
            let piece = board[row][col];
            if (piece) {
                movesObject[piece] = getPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [row, col]);
            }
        }
    }
    return movesObject;
}
exports.computePossibleMoves = computePossibleMoves;
