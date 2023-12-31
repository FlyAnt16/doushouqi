import {BOARD, DENS, NUMOFCOL, NUMOFROW, RIVER, TRAPS} from "./constants";
import {Pieces} from "./Pieces";
import {INVALID_MOVE} from "boardgame.io/core";


export const DouSHouQi = {
    setup : () => {
        return {
            selectedPiece: null,
            selectedRow : null,
            selectedCol : null,
            cells: Object.assign([], BOARD),
            pieces : Object.assign({}, JSON.parse(JSON.stringify(Pieces))),
        }
    },

    moves : {
        onClick : ({G, playerID, events}, row, col) => {
            if (G.selectedPiece !== null) {
                let possibleMoves = getPossibleMoves(G);
                if (possibleMoves.some(a => (a[0]===parseInt(row) && a[1]===parseInt(col)))){
                    G.cells[row][col] = G.selectedPiece;
                    G.cells[G.selectedRow][G.selectedCol] = null;
                    if (isEnemyTrap(G.pieces[G.selectedPiece].playerNumber, [row, col])){
                        G.pieces[G.selectedPiece].value = -1
                    } else {
                        G.pieces[G.selectedPiece].value = G.pieces[G.selectedPiece].defaultValue
                    }
                    G.selectedPiece = null;
                    G.selectedRow = null;
                    G.selectedCol = null;
                    events.endTurn();
                }
            } else {
                if (G.cells[row][col] === null) {
                    return INVALID_MOVE;
                }
                if (G.pieces[G.cells[row][col]].playerNumber !== parseInt(playerID)) {
                    return INVALID_MOVE;
                } else {
                    G.selectedPiece = G.cells[row][col]
                    G.selectedRow = row
                    G.selectedCol = col
                }
            }
        }

    },

    endIf : ({G, ctx}) => {
        if (Object.values(DENS).flat().some(a => (G.cells[a[0]][a[1]] !== null))){
            return {winner: ctx.currentPlayer}
        }
    },
}

function isEnemyTrap(playerNumber, [row, col]){
    return TRAPS[1-playerNumber].some(a => (a[0]===parseInt(row) && a[1]===parseInt(col)))
}

function isRiver([row, col]){
    return RIVER.some(a => (a[0]===row && a[1]===col))
}

function isFriendlyDen(pieces, piece, [row, col]){
    return DENS[pieces[piece].playerNumber].some(a => (a[0]===row && a[1]===col))
}

function checkValidSquare(board, pieces, piece, [row, col]){
    if (board[row][col] !== null){
        if (pieces[piece].playerNumber!==pieces[board[row][col]].playerNumber){
            if (pieces[piece].value===0 && pieces[board[row][col]].value===7){
                return true
            } else{
                if (pieces[piece].value===7 && pieces[board[row][col]].value===0){
                    return false
                } else {
                    return pieces[piece].value>=pieces[board[row][col]].value
                }
            }
        }
        return false
    }
    return true
}

function getReachableSquares(board, pieces, piece, [row, col]){
    let reachableSquares = []
    if (row>0){
        if (!isRiver([row-1, col])){
            if (!isFriendlyDen(pieces, piece, [row-1, col])) {
                reachableSquares.push([row - 1, col])
            }
        } else{
            if (pieces[piece].canEnterRiver){
                reachableSquares.push([row-1, col])
            } else {
                if (pieces[piece].canCrossRiver){
                    let endRow = row-1
                    let blocked = false
                    while (isRiver([endRow, col])){
                        if (board[endRow][col] !== null) {
                            blocked = true
                            break
                        }
                        endRow -= 1
                    }
                    if (!blocked){
                        reachableSquares.push([endRow, col])
                    }
                }
            }
        }
    }

    if (row<NUMOFROW-1){
        if (!isRiver([row+1, col])) {
            if (!isFriendlyDen(pieces, piece, [row+1, col])){
                reachableSquares.push([row + 1, col])
            }
        } else{
            if (pieces[piece].canEnterRiver){
                reachableSquares.push([row+1, col])
            } else {
                if (pieces[piece].canCrossRiver){
                    let endRow = row+1
                    let blocked = false
                    while (isRiver([endRow, col])){
                        if (board[endRow][col] !== null) {
                            blocked = true
                            break
                        }
                        endRow += 1
                    }
                    if (!blocked){
                        reachableSquares.push([endRow, col])
                    }
                }
            }
        }
    }

    if (col>0){
        if (!isRiver([row, col-1])){
            if (!isFriendlyDen(pieces, piece, [row, col-1])) {
                reachableSquares.push([row, col - 1])
            }
        } else{
            if (pieces[piece].canEnterRiver){
                reachableSquares.push([row, col-1])
            } else {
                if (pieces[piece].canCrossRiver){
                    let endCol = col-1
                    let blocked = false
                    while (isRiver([row, endCol])){
                        if (board[row][endCol] !== null) {
                            blocked = true
                            break
                        }
                        endCol -= 1
                    }
                    if (!blocked){
                        reachableSquares.push([row, endCol])
                    }
                }
            }
        }
    }

    if (col<NUMOFCOL-1){
        if (!isRiver([row, col+1])){
            if (!isFriendlyDen(pieces, piece, [row, col+1])){
                reachableSquares.push([row, col+1])
                }
        } else{
            if (pieces[piece].canEnterRiver){
                reachableSquares.push([row, col+1])
            } else {
                if (pieces[piece].canCrossRiver){
                    let endCol = col+1
                    let blocked = false
                    while (isRiver([row, endCol])){
                        if (board[row][endCol] !== null) {
                            blocked = true
                            break
                        }
                        endCol += 1
                    }
                    if (!blocked){
                        reachableSquares.push([row, endCol])
                    }
                }
            }
        }
    }
    return reachableSquares
}

function getPossibleMoves(G){
    let possibleMoves = []
    let reachableSquares = getReachableSquares(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol])
    reachableSquares.forEach( ([row,col]) => {if (checkValidSquare(G.cells, G.pieces, G.selectedPiece, [row, col])) possibleMoves.push([row, col])} )
    return possibleMoves
}