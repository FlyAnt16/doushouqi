
let defaultNumRow = 9;
let defaultNumCol = 7;
let defaultPieceOrder = ['elephant', 'wolf', 'panther', 'rat', 'cat', 'dog', 'tiger', 'lion']
let defaultPiecePosition = [[6,0], [6,2], [6,4], [6,6], [7,1], [7,5], [8,0], [8,6]]
let defaultPlayerOneTraps = [[8,2],[8,4],[7,3]]
let defaultPlayerOneDen = [[8,3]]
let defaultRiver = [[3,1], [3,2], [4,1], [4,2], [5,1], [5,2], [3,4], [3,5], [4,4], [4,5], [5,4], [5,5]]

export type BoardType = (string|null)[][];
export type PlayerSquareType = {[key: number]: number[][]}
export var NUMOFROW : number;
export var NUMOFCOL : number;
export var BOARD : BoardType ;
export var TRAPS : PlayerSquareType;
export var DENS : PlayerSquareType;
export var RIVER : number[][];
export var TERRAIN : BoardType;

export function createNullBoard() : BoardType {
    return new Array(NUMOFROW).fill(null).map(() => new Array(NUMOFCOL).fill(null))
}
function initialiseBoard(pieceOrder:string[], piecePosition:number[][]){
    let board = createNullBoard();
    for (let i=0; i<piecePosition.length; i++){
        board[piecePosition[i][0]][piecePosition[i][1]] = pieceOrder[i]+'0';
        board[NUMOFROW-1-piecePosition[i][0]][NUMOFCOL-1-piecePosition[i][1]] = pieceOrder[i]+'1';
    }
    return board;
}

function initialiseTerrain(){
    let board = createNullBoard()
    RIVER.forEach( ([row,col]) => board[row][col]='river')
    TRAPS[0].forEach(([row, col]) => board[row][col]='trap0')
    TRAPS[1].forEach(([row, col]) => board[row][col]='trap1')
    DENS[0].forEach(([row, col]) => board[row][col]='den0')
    DENS[1].forEach(([row, col]) => board[row][col]='den1')
    return board
}


let reflectPosition = ([row, col]:number[]):number[] => ([NUMOFROW-1-row, NUMOFCOL-1-col])

function initialiseTraps(onePlayerTraps:number[][]):PlayerSquareType {
    return({
        0 : onePlayerTraps,
        1 : onePlayerTraps.map(reflectPosition)
    })
}

function initialiseDen(onePlayerDen:number[][]):PlayerSquareType{
    return({
        0 : onePlayerDen,
        1 : onePlayerDen.map(reflectPosition)
    })
}

function initialiseRiver(river:number[][]) {
    return river
}

function initialiseNumRow(numRow:number) {return numRow}

function initialiseNumCol(numCol:number) {return numCol}

function shuffleArray<T>(array:T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


export function initialiseSettings(numRow=defaultNumRow,
                                   numCol=defaultNumCol,
                                   pieceOrder=defaultPieceOrder,
                                   piecePosition = defaultPiecePosition,
                                   playerOneTraps=defaultPlayerOneTraps,
                                   playerOneDen=defaultPlayerOneDen,
                                   river=defaultRiver){
    NUMOFROW = initialiseNumRow(numRow);
    NUMOFCOL = initialiseNumCol(numCol);
    BOARD = initialiseBoard(pieceOrder, piecePosition)
    TRAPS = initialiseTraps(playerOneTraps)
    DENS = initialiseDen(playerOneDen)
    RIVER = initialiseRiver(river)
    TERRAIN = initialiseTerrain()
}

export function randomPieceSetting(){
    let pieceOrder = shuffleArray<string>(defaultPieceOrder)
    initialiseSettings(undefined, undefined, pieceOrder)
}