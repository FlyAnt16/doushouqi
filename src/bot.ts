import {BoardType, PlayerSquareType} from "./setup";
import {computePossibleMoves, DouShouQiState, getPossibleMoves, isEnemyTrap} from "./Game";
import {PiecesType} from "./Pieces";
import {Game} from "boardgame.io";

const pieceValues: {[key:string] : number} = {
    'elephantWithoutRat' : 10,
    'elephantWithRat' : 8,
    'lion' : 8,
    'tiger' : 8,
    'panther' : 5,
    'wolf' : 4,
    'dog' : 3,
    'cat' : 2,
    'rat' : 2,
}

const computeDistance = ([row,col]:number[],target:number[]) => Math.abs(target[0]-row) + Math.abs(target[1]-col);

const distanceValue = (distance:number) => {
    switch (distance) {
        case 0:
            return 1000
        case 1:
            return 10
        case 2:
            return 4
        case 3:
            return 3
        case 4:
            return 2
        default:
            return 1
    }
}

function locatePieces(board:BoardType, playerID:string):{[key:string]:number[]}{
    let pieceCoordinates:{[key:string]:number[]} = {}
    let enemyRatPresent = false
    for (let row=0; row<board.length; row++){
        for (let col=0;col<board[0].length;col++){
            let piece = board[row][col]
            if (piece!==null){
                if (piece.slice(-1) === playerID){
                    pieceCoordinates[piece.slice(0,-1)] = [row, col]
                } else if (piece.slice(0,-1) === 'rat') enemyRatPresent=true
            }
        }
    }
    if ('elephant' in pieceCoordinates){
        if (enemyRatPresent) pieceCoordinates['elephantWithRat'] = pieceCoordinates['elephant']
        else pieceCoordinates['elephantWithoutRat'] = pieceCoordinates['elephant']
        delete pieceCoordinates.elephant
    }
    return pieceCoordinates
}
function boardEvaluation(board:BoardType, playerID:string, dens:PlayerSquareType){
    let friendlyPieceCoordinates = locatePieces(board, String(1-parseInt(playerID)))
    let friendlyDenCoordinates = dens[1-parseInt(playerID)][0]
    let enemyPieceCoordinates = locatePieces(board, playerID)
    let enemyDenCoordinates = dens[parseInt(playerID)][0]
    // return Object.entries(pieceCoordinates).map(([piece, coordinate]) =>
    //     pieceValues[piece] * distanceValue(computeDistance(coordinate,enemyDenCoord))).reduce((accumulator, currentValue) =>{
    // return accumulator + currentValue},0)
    return Object.entries(friendlyPieceCoordinates).map(([piece, coordinate]) =>
        pieceValues[piece]* distanceValue(computeDistance(coordinate,enemyDenCoordinates))).reduce((accumulator, currentValue) =>{
    return accumulator + currentValue},0) - Object.entries(enemyPieceCoordinates).map(([piece, coordinate]) =>
        pieceValues[piece]* distanceValue(computeDistance(coordinate,friendlyDenCoordinates))).reduce((accumulator, currentValue) =>{
        return accumulator + currentValue},0)
}

function makeMove(board:BoardType, [initialRow, initialCol]:number[], pieces:PiecesType, [destinationRow, destinationCol]:number[], traps:PlayerSquareType, playerID:string):[BoardType, PiecesType]{
    let boardCopy = structuredClone(JSON.parse(JSON.stringify(board)))
    let piecesCopy = structuredClone(JSON.parse(JSON.stringify(pieces)))
    let selectedPiece = board[initialRow][initialCol] as string
    boardCopy[destinationRow][destinationCol] = selectedPiece
    boardCopy[initialRow][initialCol] = null
    if (isEnemyTrap(traps, parseInt(playerID), [destinationRow, destinationCol])){
        piecesCopy[selectedPiece].value = -1
    } else{
        piecesCopy[selectedPiece].value = piecesCopy[selectedPiece].defaultValue
    }
    return [boardCopy,piecesCopy]
}

function computeFriendlyPossibleMoves(board:BoardType, numOfRow:number, numOfCol:number, rivers:number[][], dens:PlayerSquareType, pieces:PiecesType, playerID:string){
    const movesArray:number[][][] = []
    for (let row=0; row<numOfRow; row++){
        for (let col=0; col<numOfCol; col++){
            let piece = board[row][col]
            if (piece && piece.slice(-1)===playerID) {
                getPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [row,col]).forEach(destination => movesArray.push([[row,col], destination]))
            }
        }
    }
    return movesArray;
}

// assume bot is player 1 and user is player 0

function findBestMove(G:DouShouQiState, botPlayerNumber:string):number[][]{
    let moves = computeFriendlyPossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces, botPlayerNumber)
    let bestMove = -1000000
    let bestMoveFound = moves[0];

    for ( const move of moves){
        let value = minimax(1, 5, false, -100000, 100000, makeMove(G.cells, move[0], G.pieces, move[1], G.traps, botPlayerNumber), G.numOfRow, G.numOfCol, G.rivers, G.dens, G.traps)
        if (value >= bestMove){
            bestMove = value;
            bestMoveFound = move;
        }
    }
    return bestMoveFound
}

function minimax(currentDepth:number, maxDepth:number, isMax:boolean, alpha:number, beta:number, [board, pieces]:[BoardType, PiecesType], numOfRow:number, numOfCol:number, rivers:number[][], dens:PlayerSquareType, traps:PlayerSquareType){
    let currentPlayer:string;
    if (isMax)
        currentPlayer='1'
    else
        currentPlayer='0'

    if (currentDepth === maxDepth)
        return boardEvaluation(board, currentPlayer, dens)
    let moves = computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, currentPlayer)

    if (isMax){
        let bestMove = -100000
        for (let i=0; i<moves.length; i++){
            //compute value
            // update bestMove
            bestMove = Math.max(bestMove, minimax(currentDepth+1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps))
            // update alpha
            alpha = Math.max(bestMove, alpha)
            // check for early stopping
            if (beta <= alpha) break
        }
        return bestMove
    } else {
        let bestMove = 100000
        for (let i=0; i<moves.length; i++){
            // compute value
            // update bestMove
            bestMove = Math.min(bestMove, minimax(currentDepth+1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps))
            // update beta
            beta = Math.min(bestMove, beta)
            // check for early stopping
            if (beta <= alpha) break
        }
        return bestMove
    }
}

export function botAction(G:DouShouQiState, botPlayerNumber:string){
    let move = findBestMove(G, botPlayerNumber)
    let [initialRow, initialCol] = move[0]
    let [destinationRow, destinationCol] = move[1]
    let selectedPiece = G.cells[initialRow][initialCol] as string

    G.cells[destinationRow][destinationCol] = selectedPiece
    G.cells[initialRow][initialCol] = null
    if (isEnemyTrap(G.traps, parseInt(botPlayerNumber), [destinationRow, destinationCol])){
        G.pieces[selectedPiece].value = -1
    } else{
        G.pieces[selectedPiece].value = G.pieces[selectedPiece].defaultValue
    }
}
//
// let board = [
//     [null, null, null],
//     ['rat1', null, null],
//     ['elephant0', null, 'lion0']
// ]
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
