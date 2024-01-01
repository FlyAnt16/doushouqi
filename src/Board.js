import React from 'react';
import {NUMOFCOL, NUMOFROW} from "./constants";

// function Square({piece, highlighted}){
//     return(
//         <div>
//
//         </div>
//     )
// }

export function Board({ctx, G, moves}) {
    const onClick = (id) => {
        let row = Math.floor(id / NUMOFCOL);
        let col = id - row * NUMOFCOL;
        return moves.onClick(row,col)
    }

    const cellStyle = {
        border : '1px solid #555',
        width : '100px',
        height : '100px',
        lineHeight : 'normal',
        textAlign : 'center',
    };

    let tbody = []
    for (let i=0; i<NUMOFROW; i++){
        let cells = [];
        for (let j=0; j<NUMOFCOL; j++){
            const id = NUMOFCOL*i+j;
            cells.push(
                <td key={id}>
                    <button style={cellStyle} onClick={() => onClick(id)}>{G.cells[i][j]}</button>
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