import {BOARD, BoardType, DENS, initialiseSettings, NUMOFCOL, NUMOFROW, RIVER, TRAPS} from "./Customise";
import {Pieces, PiecesType} from "./Pieces";
import type { Game} from "boardgame.io"

export interface DouShouQiState{
    selectedPiece : string | null,
    selectedRow : number | null,
    selectedCol : number | null,
    cells : BoardType,
    pieces : PiecesType,
}


export const DouSHouQi :Game<DouShouQiState> = {
    setup : () => {
        initialiseSettings()
        return {
            selectedPiece: null,
            selectedRow : null,
            selectedCol : null,
            cells: Object.assign([], BOARD),
            pieces : Object.assign({}, JSON.parse(JSON.stringify(Pieces))),
        }
    },

    moves : {
        onClick : ({G, playerID, events}, row: number, col:number) => {
            let selected = G.cells[row][col]
            if (selected && (G.pieces[selected].playerNumber === parseInt(playerID))){
                selectFriendlyPiece(G, row, col)
            } else {
                if (G.selectedPiece && (G.selectedRow!==null) && (G.selectedCol!==null)){
                    let possibleMoves = getPossibleMoves(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol]);
                    if (possibleMoves.some(a => (a[0]===row && a[1]===col))){
                        makeMove(G, row, col)
                        events.endTurn();
                    }
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

function selectFriendlyPiece(G:DouShouQiState, row:number, col:number) :void {
    G.selectedPiece = G.cells[row][col]
    G.selectedRow = row
    G.selectedCol = col
}

function makeMove(G:DouShouQiState, row:number, col:number){
    if ((G.selectedRow!==null) && (G.selectedCol!==null) && G.selectedPiece) {
        G.cells[row][col] = G.selectedPiece;
        G.cells[G.selectedRow][G.selectedCol] = null;
        if (isEnemyTrap(G.pieces[G.selectedPiece].playerNumber, [row, col])) {
            G.pieces[G.selectedPiece].value = -1
        } else {
            G.pieces[G.selectedPiece].value = G.pieces[G.selectedPiece].defaultValue
        }
        G.selectedPiece = null;
        G.selectedRow = null;
        G.selectedCol = null;
    }
}

const isEnemyTrap = (playerNumber:number, [row, col]:number[]) => TRAPS[1-playerNumber].some(a => (a[0]===row && a[1]===col))

const isRiver = ([row, col]:number[]) => RIVER.some(a => (a[0]===row && a[1]===col))

const isFriendlyDen = (pieces:PiecesType, piece:string, [row, col]:number[]) => DENS[pieces[piece].playerNumber].some(a => (a[0]===row && a[1]===col))

const firstPieceCanCaptureSecondPiece  = (pieces:PiecesType, piece1:string, piece2:string) =>
    pieces[piece1].playerNumber!==pieces[piece2].playerNumber && ((pieces[piece1].value===0 && pieces[piece2].value===7) || (!(pieces[piece1].value===7 && pieces[piece2].value===0) && pieces[piece1].value>=pieces[piece2].value))
// if (pieces[piece1].playerNumber!==pieces[piece2].playerNumber){
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
// return false

const checkValidSquare = (board:BoardType, pieces:PiecesType, piece:string, [row, col]:number[]) =>
board[row][col] === null || firstPieceCanCaptureSecondPiece(pieces, piece, board[row][col] as string)

// if (board[row][col] !== null){
//     return firstPieceCanCaptureSecondPiece(pieces, piece, board[row][col] as string)
// }
// return true
// }

function getReachableInOneDirection(board:BoardType, pieces:PiecesType, piece:string, [row, col]:number[], [rowChange, colChange]:number[]) {
    if (!isRiver([row+rowChange, col+colChange])){
        if (!isFriendlyDen(pieces, piece, [row+rowChange, col+colChange])){
            return [row+rowChange, col+colChange]
        }
    } else {
        if (pieces[piece].canEnterRiver) {
            return [row+rowChange, col+colChange]
        } else {
            if (pieces[piece].canCrossRiver) {
                let endRow = row + rowChange;
                let endCol = col + colChange;
                let blocked = false;
                while (isRiver([endRow, endCol])){
                    if (board[endRow][endCol] !== null) {
                        blocked = true;
                        break;
                    }
                    endRow += rowChange;
                    endCol += colChange;
                }
                if (!blocked) {
                    return [endRow, endCol]
                }
            }
        }
    }
    return null
}
function getReachableSquares(board:BoardType, pieces:PiecesType, piece:string, [row, col]:number[]){
    let reachableSquares = []
    if (row>0){
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row,col], [-1,0])
        if (reachableSquare) reachableSquares.push(reachableSquare)
    }

    if (row<NUMOFROW-1){
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row,col], [1,0])
        if (reachableSquare) reachableSquares.push(reachableSquare)
    }

    if (col>0){
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row,col], [0,-1])
        if (reachableSquare) reachableSquares.push(reachableSquare)
    }

    if (col<NUMOFCOL-1){
        let reachableSquare = getReachableInOneDirection(board, pieces, piece, [row,col], [0,1])
        if (reachableSquare) reachableSquares.push(reachableSquare)
    }
    return reachableSquares
}

export function getPossibleMoves(board:BoardType, pieces:PiecesType, piece:string, [selectedRow, selectedCol]:number[]){
    let possibleMoves:number[][] = []
    let reachableSquares = getReachableSquares(board, pieces, piece, [selectedRow, selectedCol])
    reachableSquares.forEach( ([row,col]) => {if (checkValidSquare(board, pieces, piece, [row, col])) possibleMoves.push([row, col])} )
    return possibleMoves
}