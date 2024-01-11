"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPossibleMoves = exports.DouSHouQi = void 0;
const Customise_1 = require("./Customise");
const Pieces_1 = require("./Pieces");
exports.DouSHouQi = {
    setup: () => {
        (0, Customise_1.initialiseSettings)();
        return {
            selectedPiece: null,
            selectedRow: null,
            selectedCol: null,
            cells: Object.assign([], Customise_1.BOARD),
            pieces: Object.assign({}, JSON.parse(JSON.stringify(Pieces_1.Pieces))),
        };
    },
    moves: {
        onClick: ({ G, playerID, events }, row, col) => {
            let selected = G.cells[row][col];
            if (selected && (G.pieces[selected].playerNumber === parseInt(playerID))) {
                selectFriendlyPiece(G, row, col);
            }
            else {
                if (G.selectedPiece && (G.selectedRow !== null) && (G.selectedCol !== null)) {
                    let possibleMoves = getPossibleMoves(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol]);
                    if (possibleMoves.some(a => (a[0] === row && a[1] === col))) {
                        makeMove(G, row, col);
                        events.endTurn();
                    }
                }
            }
        }
    },
    endIf: ({ G, ctx }) => {
        if (Object.values(Customise_1.DENS).flat().some(a => (G.cells[a[0]][a[1]] !== null))) {
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
        if (isEnemyTrap(G.pieces[G.selectedPiece].playerNumber, [row, col])) {
            G.pieces[G.selectedPiece].value = -1;
        }
        else {
            G.pieces[G.selectedPiece].value = G.pieces[G.selectedPiece].defaultValue;
        }
        G.selectedPiece = null;
        G.selectedRow = null;
        G.selectedCol = null;
    }
}
function isEnemyTrap(playerNumber, [row, col]) {
    return Customise_1.TRAPS[1 - playerNumber].some(a => (a[0] === row && a[1] === col));
}
function isRiver([row, col]) {
    return Customise_1.RIVER.some(a => (a[0] === row && a[1] === col));
}
function isFriendlyDen(pieces, piece, [row, col]) {
    return Customise_1.DENS[pieces[piece].playerNumber].some(a => (a[0] === row && a[1] === col));
}
function firstPieceCanCaptureSecondPiece(pieces, piece1, piece2) {
    if (pieces[piece1].playerNumber !== pieces[piece2].playerNumber) {
        if (pieces[piece1].value === 0 && pieces[piece2].value === 7) {
            return true;
        }
        else {
            if (pieces[piece1].value === 7 && pieces[piece2].value === 0) {
                return false;
            }
            else {
                return pieces[piece1].value >= pieces[piece2].value;
            }
        }
    }
    return false;
}
function checkValidSquare(board, pieces, piece, [row, col]) {
    if (board[row][col] !== null) {
        return firstPieceCanCaptureSecondPiece(pieces, piece, board[row][col]);
    }
    return true;
}
function getReachableInOneDirection(board, pieces, piece, [row, col], [rowChange, colChange]) {
    if (!isRiver([row + rowChange, col + colChange])) {
        if (!isFriendlyDen(pieces, piece, [row + rowChange, col + colChange])) {
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
                while (isRiver([endRow, endCol])) {
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
function getReachableSquares(board, pieces, piece, [row, col]) {
    let reachableSquares = [];
    if (row > 0) {
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row, col], [-1, 0]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    if (row < Customise_1.NUMOFROW - 1) {
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row, col], [1, 0]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    if (col > 0) {
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row, col], [0, -1]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    if (col < Customise_1.NUMOFCOL - 1) {
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row, col], [0, 1]);
        if (reachableSquare)
            reachableSquares.push(reachableSquare);
    }
    return reachableSquares;
}
function getPossibleMoves(board, pieces, piece, [selectedRow, selectedCol]) {
    let possibleMoves = [];
    let reachableSquares = getReachableSquares(board, pieces, piece, [selectedRow, selectedCol]);
    reachableSquares.forEach(([row, col]) => { if (checkValidSquare(board, pieces, piece, [row, col]))
        possibleMoves.push([row, col]); });
    return possibleMoves;
}
exports.getPossibleMoves = getPossibleMoves;
