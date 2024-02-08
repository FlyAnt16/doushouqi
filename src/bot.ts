import {BoardType, PlayerSquareType} from "./setup";
import {DouShouQiState, getPossibleMoves, isEnemyTrap} from "./Game";
import {PiecesType} from "./Pieces";

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
            return 5
        case 3:
            return 3
        case 4:
            return 2
        default:
            return 1
    }
}

const distanceToRiver = (rivers:number[][], [row,col]:number[]) => Math.min(...rivers.map( (river) => computeDistance([row, col],river)))-1

function pieceScore(piece:string, coordinate:number[], enemyDenCoordinates:number[], rivers:number[][]) {
    if (piece === 'tiger' || piece === 'lion') {
        return pieceValues[piece] * (distanceValue(computeDistance(coordinate, enemyDenCoordinates)) - distanceToRiver(rivers,coordinate))
    } else {
        return pieceValues[piece] * distanceValue(computeDistance(coordinate, enemyDenCoordinates))
    }
}
// return coordinate of all pieces of a given player
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

export function boardEvaluation(board:BoardType, playerID:string, dens:PlayerSquareType, rivers:number[][]){
    let friendlyPieceCoordinates = locatePieces(board, String(1-parseInt(playerID)))
    let friendlyDenCoordinates = dens[1-parseInt(playerID)][0]
    let enemyPieceCoordinates = locatePieces(board, playerID)
    let enemyDenCoordinates = dens[parseInt(playerID)][0]
    return Object.entries(friendlyPieceCoordinates).map(([piece, coordinate]) =>
        pieceScore(piece, coordinate, enemyDenCoordinates,rivers)).reduce((accumulator, currentValue) =>{
        return accumulator + currentValue},0) - Object.entries(enemyPieceCoordinates).map(([piece, coordinate]) =>
        pieceScore(piece, coordinate, friendlyDenCoordinates,rivers)).reduce((accumulator, currentValue) =>{
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

const isCapture = (move:number[][], board:BoardType) => board[move[1][0]][move[1][1]]!==null
// @ts-ignore
const isLionOrTigerMove = (move:number[][], board:BoardType) => ['tiger','lion'].indexOf(board[move[0][0]][move[0][1]].slice(0,-1))>=0;
const moveScore = (move:number[][], board:BoardType) => {
    if (isCapture(move, board)) return 2
    else if (isLionOrTigerMove(move, board)) return 1
    else return 0
}
const firstMoveMoreImportantThanSecondMove = (firstMove:number[][], secondMove:number[][], board:BoardType) => moveScore(firstMove,board)>moveScore(secondMove,board)

// order the move so capture goes first, then tiger/lion moves then the rest
function moveOrdering(moves:number[][][], board:BoardType){
    for (let i=0; i<moves.length-1; i++){
        for (let j=i+1; j<moves.length; j++){
            if (firstMoveMoreImportantThanSecondMove(moves[j], moves[i], board)){
                [moves[i],moves[j]] = [moves[j], moves[i]]
            }
        }
    }
    return moves
}

function findBestMove(G:DouShouQiState, botPlayerNumber:string):number[][]{
    if (boardToString(G.cells, G.numOfRow, G.numOfCol) in G.transposition) return G.transposition[boardToString(G.cells, G.numOfRow, G.numOfCol)][0]
    let moves = computeFriendlyPossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces, botPlayerNumber)
    moves = moveOrdering(moves, G.cells)
    let bestMove = -1000000
    let bestMoveFound = moves[0];

    for ( const move of moves){
        let value = minimax(1, 5, false, -100000, 100000, makeMove(G.cells, move[0], G.pieces, move[1], G.traps, botPlayerNumber), G.numOfRow, G.numOfCol, G.rivers, G.dens, G.traps, G.transposition)
        if (value >= bestMove){
            bestMove = value;
            bestMoveFound = move;
        }
    }
    return bestMoveFound
}

function gameEnd(board:BoardType, dens:PlayerSquareType){
    return Object.values(dens).flat().some(a => (board[a[0]][a[1]] !== null))
}

function minimax(currentDepth:number, maxDepth:number, isMax:boolean, alpha:number, beta:number, [board, pieces]:[BoardType, PiecesType], numOfRow:number, numOfCol:number, rivers:number[][], dens:PlayerSquareType, traps:PlayerSquareType, transposition:{[key:string] : [number[][], number]}){
    let currentPlayer:string;
    if (isMax)
        currentPlayer='1'
    else
        currentPlayer='0'

    if (currentDepth === maxDepth || gameEnd(board, dens)) {
        return boardEvaluation(board, currentPlayer, dens, rivers)
    }

    let moves = computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, currentPlayer)
    moves = moveOrdering(moves, board)
    if (isMax){
        let bestMove = -100000
        if (boardToString(board, numOfRow, numOfCol) in transposition) {
            bestMove = transposition[boardToString(board, numOfRow, numOfCol)][1]
        } else {

            for (let i = 0; i < moves.length; i++) {
                bestMove = Math.max(bestMove, minimax(currentDepth + 1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps, transposition))
                alpha = Math.max(bestMove, alpha)
                if (beta <= alpha) break
            }
        }
        return bestMove
    } else {
        let bestMove = 100000
        for (let i=0; i<moves.length; i++){
            bestMove = Math.min(bestMove, minimax(currentDepth+1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps, transposition))
            beta = Math.min(bestMove, beta)
            if (beta <= alpha) break
        }
        return bestMove
    }
}

export function botAction(G:DouShouQiState, botPlayerNumber:string){
    // TODO: bot doesn't want to make the winning move (enter den)
    // TODO: transposition table only assume bot is second player (i.e. playerNumber = '1')
    let move = findBestMove(G, botPlayerNumber)
    let currentBoardString = boardToString(G.cells,G.numOfRow, G.numOfCol)
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
    G.transposition[currentBoardString] = [move, boardEvaluation(G.cells, botPlayerNumber, G.dens, G.rivers)]
}

function pieceToDigit(piece:string){
    switch (piece){
        case 'elephant':
            return '9'
        case 'lion':
            return '8'
        case 'tiger':
            return '7'
        case 'panther':
            return '6'
        case 'wolf':
            return '5'
        case 'dog':
            return '4'
        case 'cat':
            return '3'
        case 'rat':
            return '2'
    }
}

function boardToString(board:BoardType, numOfRow:number, numOfCol:number):string{
    let boardString = ''
    for (let row=0;row<numOfRow;row++){
        for (let col=0;col<numOfCol;col++){
            let piece = board[row][col]
            if (piece) boardString = boardString + pieceToDigit(piece.slice(0,-1)) + piece.slice(-1)
            else boardString = boardString + '00'
        }
    }
    return boardString
}
