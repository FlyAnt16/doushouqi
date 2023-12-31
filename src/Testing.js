const NUMOFROW = 9;
const NUMOFCOL = 7;

const RIVER = [
    [3,1], [3,2], [4,1], [4,2], [5,1], [5,2], [3,4], [3,5], [4,4], [4,5], [5,4], [5,5]
]
const DENS = {
    0 : [[8,3]],
    1 : [[3,0]]
}
class Piece{
    constructor(value, canEnterRiver, canCrossRiver, playerNumber) {
        this.defaultValue = value;
        this.value = value;
        this.canEnterRiver = canEnterRiver;
        this.canCrossRiver = canCrossRiver;
        this.playerNumber = playerNumber;
    }

}

const Pieces = {
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

function isRiver([row, col]){
    return RIVER.some(a => (a[0]===row && a[1]===col))
}

function isFriendlyDen(piece, [row, col]){
    return DENS[Pieces[piece].playerNumber].some(a => (a[0]===row && a[1]===col))
}
function checkValidSquare(board, piece, [row, col]){
    if (board[row][col] !== null){
            if (Pieces[piece].playerNumber!==Pieces[board[row][col]].playerNumber){
                if (Pieces[piece].value===0 && Pieces[board[row][col]].value===7){
                    return true
                } else{
                    if (Pieces[piece].value===7 && Pieces[board[row][col]].value===0){
                        return false
                    } else {
                        return Pieces[piece].value>=Pieces[board[row][col]].value
                    }
                }
            }
            return false
    }
    return true
}

function getReachableSquares(board, piece, [row, col]){
    let reachableSquares = []
    if (row>0){
        if (!isRiver([row-1, col])){
            if (!isFriendlyDen(piece, [row-1, col])) {
                reachableSquares.push([row - 1, col])
            }
        } else{
            if (Pieces[piece].canEnterRiver){
                reachableSquares.push([row-1, col])
            } else {
                if (Pieces[piece].canCrossRiver){
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
            if (!isFriendlyDen(piece, [row+1, col])){
                reachableSquares.push([row + 1, col])
            }
        } else{
            if (Pieces[piece].canEnterRiver){
                reachableSquares.push([row+1, col])
            } else {
                if (Pieces[piece].canCrossRiver){
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
            if (!isFriendlyDen(piece, [row, col-1])) {
                reachableSquares.push([row, col - 1])
            }
        } else{
            if (Pieces[piece].canEnterRiver){
                reachableSquares.push([row, col-1])
            } else {
                if (Pieces[piece].canCrossRiver){
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
            if (!isFriendlyDen(piece, [row, col+1])){
                reachableSquares.push([row, col+1])
            }
        } else{
            if (Pieces[piece].canEnterRiver){
                reachableSquares.push([row, col+1])
            } else {
                if (Pieces[piece].canCrossRiver){
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

function getPossibleMoves(board, selectedPiece, [selectedRow, selectedCol]){
    let possibleMoves = []
    let reachableSquares = getReachableSquares(board, selectedPiece, [selectedRow, selectedCol])
    reachableSquares.forEach( ([row,col]) => {if (checkValidSquare(board, selectedPiece, [row, col])) possibleMoves.push([row, col])} )
    return possibleMoves
}

// Set up a board with two squares
let board = [
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

console.log(getReachableSquares(board, 'cat0',[0,2]))
let possibleMoves = getPossibleMoves(board, 'tiger0', [8,0])
console.log(possibleMoves.some(a => (a[0]===7 && a[1]===0)))

console.log(JSON.parse(JSON.stringify(Pieces))["elephant0"])
console.log(Object.values(DENS).flat())