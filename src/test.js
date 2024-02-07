function getPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [selectedRow, selectedCol]) {
    let possibleMoves = [];
    let reachableSquares = getReachableSquares(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [selectedRow, selectedCol]);
    reachableSquares.forEach(([row, col]) => { if (checkValidSquare(board, pieces, piece, [row, col]))
        possibleMoves.push([row, col]); });
    return possibleMoves;
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
const checkValidSquare = (board, pieces, piece, [row, col]) => {
    if (board[row][col] !== null) {
        return firstPieceCanCaptureSecondPiece(pieces, piece, board[row][col]);
    }
    return true;
};
const firstPieceCanCaptureSecondPiece = (pieces, piece1, piece2) => pieces[piece1].playerNumber !== pieces[piece2].playerNumber && ((pieces[piece1].value === 0 && pieces[piece2].value === 7) || (!(pieces[piece1].value === 7 && pieces[piece2].value === 0) && pieces[piece1].value >= pieces[piece2].value));
const isRiver = (rivers, [row, col]) => rivers.some(a => (a[0] === row && a[1] === col));
const isFriendlyDen = (dens, pieces, piece, [row, col]) => dens[pieces[piece].playerNumber].some(a => (a[0] === row && a[1] === col));



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
const computeDistance = ([row, col], target) => Math.abs(target[0] - row) + Math.abs(target[1] - col);
const distanceValue = (distance) => {
    switch (distance) {
        case 0:
            return 1000;
        case 1:
            return 10;
        case 2:
            return 4;
        case 3:
            return 3;
        case 4:
            return 2;
        default:
            return 1;
    }
};
const isEnemyTrap = (traps ,playerNumber, [row, col]) => traps[1-playerNumber].some(a => (a[0]===row && a[1]===col))

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
function boardEvaluation(board, playerID, enemyDenCoord) {
    let friendlyPieceCoordinates = locatePieces(board, String(1-parseInt(playerID)));
    let enemyPieceCoordinates = locatePieces(board, playerID)
    // return Object.entries(pieceCoordinates).map(([piece, coordinate]) =>
    //     pieceValues[piece] * distanceValue(computeDistance(coordinate,enemyDenCoord))).reduce((accumulator, currentValue) =>{
    // return accumulator + currentValue},0)
    console.log(Object.entries(friendlyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece]).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0) - Object.entries(enemyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece]).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0))
    return Object.entries(friendlyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece]).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0) - Object.entries(enemyPieceCoordinates).map(([piece, coordinate]) => pieceValues[piece]).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
}
function makeMove(board, [initialRow, initialCol], pieces, [destinationRow, destinationCol], traps, playerID) {
    let boardCopy = structuredClone(JSON.parse(JSON.stringify(board)));
    let piecesCopy = structuredClone(JSON.parse(JSON.stringify(pieces)));
    let selectedPiece = board[initialRow][initialCol];
    boardCopy[destinationRow][destinationCol] = selectedPiece;
    boardCopy[initialRow][initialCol] = null;
    if (isEnemyTrap(traps, parseInt(playerID), [destinationRow, destinationCol])) {
        piecesCopy[selectedPiece].value = -1;
    }
    else {
        piecesCopy[selectedPiece].value = piecesCopy[selectedPiece].defaultValue;
    }
    return [boardCopy, piecesCopy];
}
function computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, playerID) {
    const movesArray = [];
    for (let row = 0; row < numOfRow; row++) {
        for (let col = 0; col < numOfCol; col++) {
            let piece = board[row][col];
            if (piece && piece.slice(-1) === playerID) {
                getPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, piece, [row, col]).forEach(destination => movesArray.push([[row, col], destination]));
            }
        }
    }
    return movesArray;
}
// assume bot is player 1 and user is player 0
function findBestMove(G, botPlayerNumber) {
    let moves = computeFriendlyPossibleMoves(G.cells, G.numOfRow, G.numOfCol, G.rivers, G.dens, G.pieces, botPlayerNumber);
    let bestMove = -1000000;
    let bestMoveFound = moves[0];
    for (const move of moves) {
        let value = minimax(1, 1, false, -100000, 100000, makeMove(G.cells, move[0], G.pieces, move[1], G.traps, botPlayerNumber), G.numOfRow, G.numOfCol, G.rivers, G.dens, G.traps);
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = move;
        }
    }
    return bestMoveFound;
}

function minimax(currentDepth, maxDepth, isMax, alpha, beta, [board, pieces], numOfRow, numOfCol, rivers, dens, traps) {
    let currentPlayer;
    if (isMax)
        currentPlayer = '1';
    else
        currentPlayer = '0';
    if (currentDepth === maxDepth)
        return boardEvaluation(board, currentPlayer, dens[1 - parseInt(currentPlayer)][0]);
    let moves = computeFriendlyPossibleMoves(board, numOfRow, numOfCol, rivers, dens, pieces, currentPlayer);
    if (isMax) {
        let bestMove = -100000;
        for (let i = 0; i < moves.length; i++) {
            //compute value
            // update bestMove
            bestMove = Math.max(bestMove, minimax(currentDepth + 1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps));
            // update alpha
            alpha = Math.max(bestMove, alpha);
            // check for early stopping
            if (beta <= alpha)
                break;
        }
        return bestMove;
    }
    else {
        let bestMove = 100000;
        for (let i = 0; i < moves.length; i++) {
            // compute value
            // update bestMove
            bestMove = Math.min(bestMove, minimax(currentDepth + 1, maxDepth, !isMax, alpha, beta, makeMove(board, moves[i][0], pieces, moves[i][1], traps, currentPlayer), numOfRow, numOfCol, rivers, dens, traps));
            // update beta
            beta = Math.min(bestMove, beta);
            // check for early stopping
            if (beta <= alpha)
                break;
        }
        return bestMove;
    }
}
function botAction(G, botPlayerNumber) {
    let move = findBestMove(G, botPlayerNumber);
    let [initialRow, initialCol] = move[0];
    let [destinationRow, destinationCol] = move[1];
    let selectedPiece = G.cells[initialRow][initialCol];
    G.cells[destinationRow][destinationCol] = selectedPiece;
    G.cells[initialRow][initialCol] = null;
    if (isEnemyTrap(G.traps, parseInt(botPlayerNumber), [destinationRow, destinationCol])) {
        G.pieces[selectedPiece].value = -1;
    }
    else {
        G.pieces[selectedPiece].value = G.pieces[selectedPiece].defaultValue;
    }
}

let smallBoard = [
    [null, null, null, null],
    ['cat1', null, null, null],
    ['elephant0', null, 'lion0', null],
    [null, null, null, null]
]

let largeBoard = [
    ['lion1', null, null, null, null, null, 'tiger1'],
    [null, 'dog1', null, null, null, 'cat1', null],
    ['rat1', null, 'panther1', null, 'wolf1', null, 'elephant1'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['elephant0', null, 'wolf0', null, 'panther0', null, 'rat0'],
    [null, 'cat0', null, null, null, 'dog0', null],
    ['tiger0', null, null, null, null, null, 'lion0']
]

class Piece{
    constructor(value, canEnterRiver, canCrossRiver, playerNumber) {
        this.defaultValue = value;
        this.value = value;
        this.canEnterRiver = canEnterRiver;
        this.canCrossRiver = canCrossRiver;
        this.playerNumber = playerNumber;
    }
}

const pieces= {
    'elephant0' : new Piece(7,false, false, 0),
    'lion0' : new Piece(6, false, true, 0),
    'tiger0' : new Piece(5,false, true, 0),
    'panther0' : new Piece(4, false, false, 0),
    'wolf0' : new Piece(3, false, false, 0),
    'dog0' : new Piece(2, false, false, 0),
    'cat0' : new Piece(1, false, false, 0),
    'rat0' : new Piece(0, true, false, 0),
    'elephant1' : new Piece(7,false, false, 1),
    'lion1' : new Piece(6, false, true, 1),
    'tiger1' : new Piece(5,false, true, 1),
    'panther1' : new Piece(4, false, false, 1),
    'wolf1' : new Piece(3, false, false, 1),
    'dog1' : new Piece(2, false, false, 1),
    'cat1' : new Piece(1, false, false, 1),
    'rat1' : new Piece(0, true, false, 1)
}

let G = {
    cells : largeBoard,
    numOfRow : 9,
    numOfCol : 7,
    rivers : [],
    dens : {1:[[0,2]],0:[[3,1]]},
    pieces : pieces,
    traps : {1:[[0,1],[1,2],[0,3]], 0:[[3,0],[2,1],[3,2]]}
}
console.log(findBestMove(G, '1'))
// console.log(result)
// console.log(result['pieceCoordinate'])
// console.log(computeFriendlyPossibleMoves(board, 3,3,[[0,0]],dens, pieces, '0'))
