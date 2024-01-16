import {BoardType} from "./setup";

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

function boardEvaluation(pieceCoordinates:{[key:string]:number[]}, enemyRatPresent:boolean, enemyDenCoord:number[]){
    if ('elephant' in pieceCoordinates){
        if (enemyRatPresent) pieceCoordinates['elephantWithRat'] = pieceCoordinates['elephant']
        else pieceCoordinates['elephantWithoutRat'] = pieceCoordinates['elephant']
        delete pieceCoordinates.elephant
    }
    return Object.entries(pieceCoordinates).map(([piece, coordinate]) =>
        pieceValues[piece] * distanceValue(computeDistance(coordinate,enemyDenCoord))).reduce((accumulator, currentValue) =>{
    return accumulator + currentValue},0)
}

function locatePieces(board:BoardType, playerID:string){
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
    return {'pieceCoordinate':pieceCoordinates, 'enemyRatPresent':enemyRatPresent}
}

// function botAction(board:BoardType, possibleMovesLookUp:{ [key: string] : number[][]}, botPlayerNumber:string){
//     return
// }

let board = [
    [null, null, null],
    ['rat1', null, null],
    ['elephant0', null, 'lion0']
]
let den = [0,1]
let result = locatePieces(board, '0')
console.log(result)
console.log(result['pieceCoordinate'])
console.log(boardEvaluation({ 'elephant': [ 2, 0 ], 'lion': [ 2, 2 ] }, false, den))
console.log(boardEvaluation(result['pieceCoordinate'], result['enemyRatPresent'],den))