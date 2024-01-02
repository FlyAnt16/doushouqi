import React from 'react';
import './Board.css';
import {NUMOFCOL, NUMOFROW, TERRAIN} from "./constants";
import {getPossibleMoves} from "./Game";





export function Board({ctx, G, moves}) {
    const onClick = (id) => {
        let row = Math.floor(id / NUMOFCOL);
        let col = id - row * NUMOFCOL;
        return moves.onClick(row,col)
    }

    function createNullBoard() {
        return new Array(NUMOFROW).fill(null).map(() => new Array(NUMOFCOL).fill(null))
    }

    let possibleMoves = []
    if (G.selectedPiece) possibleMoves = getPossibleMoves(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol])
    let possibleMovesBoard = createNullBoard()
    possibleMoves.forEach( ([row, col]) => possibleMovesBoard[row][col]='possibleMove')


    let tbody = []
    for (let i=0; i<NUMOFROW; i++){
        let cells = [];
        for (let j=0; j<NUMOFCOL; j++){
            const id = NUMOFCOL*i+j;
            cells.push(
                <td key={id}>
                    <button className={["cell", TERRAIN[i][j], G.cells[i][j], possibleMovesBoard[i][j]].join(" ")} onClick={() => onClick(id)}>{G.cells[i][j]}</button>
                </td>
            )
        }
        tbody.push(<tr key={i}>{cells}</tr>);
    }

    return(
        <div>
            <table id="board">
                <tbody>{tbody}</tbody>
            </table>
        </div>
    );
}