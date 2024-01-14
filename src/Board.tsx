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
import {Ctx} from "boardgame.io";

const reflectRow = (row:number, playerID:string) => playerID==='0' ? row : NUMOFROW-1-row
const reflectCol = (col:number, playerID:string) => playerID==='0' ? col : NUMOFCOL-1-col

interface DouShouQiProps extends BoardProps<DouShouQiState>{}
export function Board({ctx, G, moves, playerID}:DouShouQiProps) {
    const onClick = (id:number) => {
        let row = Math.floor(id / NUMOFCOL);
        let col = id - row * NUMOFCOL;
        return moves.onClick(row,col)
    }

    let possibleMoves:number[][] = []
    if (G.selectedPiece && (G.selectedRow!==null) && (G.selectedCol!==null)) possibleMoves = getPossibleMoves(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol])
    let possibleMovesBoard = createNullBoard()
    possibleMoves.forEach( ([row, col]) => possibleMovesBoard[row][col]='possibleMove')

    return(
        <div className={'screen'}>
            <div>
                <table id="board">
                    <tbody>
                    {[...Array(NUMOFROW).keys()].map((row) =>
                        <tr key={row}>
                            {[...Array(NUMOFCOL).keys()].map(col => {
                                // TODO: add mode variable for pass and play / opposite play / multiplayer change currentPlayer to playerID for multiplayer
                                let playerRow = reflectRow(row, ctx.currentPlayer as string)
                                let playerCol = reflectCol(col, ctx.currentPlayer as string)
                                return <td key={row * NUMOFCOL + col}>
                                    <button className={["cell", TERRAIN[playerRow][playerCol], G.cells[playerRow][playerCol], possibleMovesBoard[playerRow][playerCol]].join(" ")}
                                            onClick={() => onClick(playerRow*NUMOFCOL+playerCol)}></button>
                                </td>})}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className='pieceOrder'>
                Piece order:
                <img alt='elephant' width={'40px'} height={'40px'} src={elephant}/>
                &gt;
                <img alt='lion' width={'40px'} height={'40px'} src={lion}/>
                &gt;
                <img alt='tiger' width={'40px'} height={'40px'} src={tiger}/>
                &gt;
                <img alt='panther' width={'40px'} height={'40px'} src={panther}/>
                &gt;
                <img alt='wolf' width={'40px'} height={'40px'} src={wolf}/>
                &gt;
                <img alt='dog' width={'40px'} height={'40px'} src={dog}/>
                &gt;
                <img alt='cat' width={'40px'} height={'40px'} src={cat}/>
                &gt;
                <img alt='rat' width={'40px'} height={'40px'} src={rat}/>
                &gt;
                <img alt='elephant' width={'40px'} height={'40px'} src={elephant}/>
            </div>
        </div>
    );
}