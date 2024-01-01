import React from 'react';
import './Board.css';
import {NUMOFCOL, NUMOFROW, TERRAIN} from "./constants";





export function Board({ctx, G, moves}) {
    const onClick = (id) => {
        let row = Math.floor(id / NUMOFCOL);
        let col = id - row * NUMOFCOL;
        return moves.onClick(row,col)
    }

    let tbody = []
    for (let i=0; i<NUMOFROW; i++){
        let cells = [];
        for (let j=0; j<NUMOFCOL; j++){
            const id = NUMOFCOL*i+j;
            cells.push(
                <td key={id}>
                    <button className={["cell", TERRAIN[i][j], G.cells[i][j]].join(" ")} onClick={() => onClick(id)}>{G.cells[i][j]}</button>
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