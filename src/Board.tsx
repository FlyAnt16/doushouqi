import React from 'react';
import './Board.css';
import {createNullBoard, NUMOFCOL, NUMOFROW, TERRAIN} from "./Customise";
import {DouShouQiState, getPossibleMoves} from "./Game";
import elephant from './images/elephant0.png'
import lion from './images/lion0.png'
import tiger from './images/tiger0.png'
import panther from './images/panther0.png'
import wolf from './images/wolf0.png'
import dog from './images/dog0.png'
import cat from './images/cat0.png'
import rat from './images/rat0.png'
import {BoardProps} from "boardgame.io/react";

interface DouShouQiProps extends BoardProps<DouShouQiState>{}
export function Board({ctx, G, moves}:DouShouQiProps) {
    const onClick = (id:number) => {
        let row = Math.floor(id / NUMOFCOL);
        let col = id - row * NUMOFCOL;
        return moves.onClick(row,col)
    }

    let possibleMoves:number[][] = []
    if (G.selectedPiece && (G.selectedRow!==null) && (G.selectedCol!==null)) possibleMoves = getPossibleMoves(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol])
    let possibleMovesBoard = createNullBoard()
    possibleMoves.forEach( ([row, col]) => possibleMovesBoard[row][col]='possibleMove')


    let tbody = []
    for (let i=0; i<NUMOFROW; i++){
        let cells = [];
        for (let j=0; j<NUMOFCOL; j++){
            const id = NUMOFCOL*i+j;
            cells.push(
                <td key={id}>
                    <button className={["cell", TERRAIN[i][j], G.cells[i][j], possibleMovesBoard[i][j]].join(" ")} onClick={() => onClick(id)}></button>
                </td>
            )
        }
        tbody.push(<tr key={i}>{cells}</tr>);
    }

    return(
        <div>
            <div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
            </div>
            <div className='pieceOrder'>
                Piece order:
                <img alt='elephant' width={'40px'} height={'40px'} src={elephant}/>
                {'>'}
                <img alt='lion' width={'40px'} height={'40px'} src={lion}/>
                {'>'}
                <img alt='tiger' width={'40px'} height={'40px'} src={tiger}/>
                {'>'}
                <img alt='panther' width={'40px'} height={'40px'} src={panther}/>
                {'>'}
                <img alt='wolf' width={'40px'} height={'40px'} src={wolf}/>
                {'>'}
                <img alt='dog' width={'40px'} height={'40px'} src={dog}/>
                {'>'}
                <img alt='cat' width={'40px'} height={'40px'} src={cat}/>
                {'>'}
                <img alt='rat' width={'40px'} height={'40px'} src={rat}/>
                {'>'}
                <img alt='elephant' width={'40px'} height={'40px'} src={elephant}/>
            </div>
        </div>
    );
}