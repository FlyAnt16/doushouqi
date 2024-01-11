class Piece{
    readonly defaultValue : number;
    value : number;
    readonly canEnterRiver : boolean;
    readonly canCrossRiver : boolean;
    readonly playerNumber : number

    constructor(value:number, canEnterRiver:boolean, canCrossRiver:boolean, playerNumber:number) {
        this.defaultValue = value;
        this.value = value;
        this.canEnterRiver = canEnterRiver;
        this.canCrossRiver = canCrossRiver;
        this.playerNumber = playerNumber;
    }
}

export type PiecesType = {
    [key: string] : Piece;
};

export const Pieces:PiecesType = {
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

console.log(JSON.parse(JSON.stringify(Pieces)))