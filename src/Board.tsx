import React, {useMemo} from 'react';
import './Board.css';
import {DouShouQiState} from "./Game";
import elephant from './images/elephant0.png'
import lion from './images/lion0.png'
import tiger from './images/tiger0.png'
import panther from './images/panther0.png'
import wolf from './images/wolf0.png'
import dog from './images/dog0.png'
import cat from './images/cat0.png'
import rat from './images/rat0.png'
import {BoardProps} from "boardgame.io/react";
import {createNullBoard, PlayerSquareType} from "./setup";

const reflectRow = (numOfRow:number, row:number, playerID:string) => playerID==='0' ? row : numOfRow-1-row
const reflectCol = (numOfCol:number, col:number, playerID:string) => playerID==='0' ? col : numOfCol-1-col

interface DouShouQiProps extends BoardProps<DouShouQiState>{}

function initialiseTerrain(numOfRow:number, numOfCol:number, traps:PlayerSquareType, dens:PlayerSquareType, rivers:number[][]){
    let board = createNullBoard(numOfRow, numOfCol)
    rivers.forEach( ([row,col]) => board[row][col]='river')
    traps[0].forEach(([row, col]) => board[row][col]='trap0')
    traps[1].forEach(([row, col]) => board[row][col]='trap1')
    dens[0].forEach(([row, col]) => board[row][col]='den0')
    dens[1].forEach(([row, col]) => board[row][col]='den1')
    return board
}

const isPossibleMove = (possibleMoves:number[][], [row,col]:number[]) => possibleMoves.some(a => (a[0]===row && a[1]===col))
export function Board({ctx, G, moves, playerID}:DouShouQiProps) {
    const terrain = useMemo(() => initialiseTerrain(G.numOfRow, G.numOfCol, G.traps, G.dens, G.rivers), [G.numOfRow, G.numOfCol, G.traps, G.dens, G.rivers]);
    const onClick = (id:number) => {
        let row = Math.floor(id / G.numOfRow);
        let col = id - row * G.numOfCol;
        return moves.onClick(row,col)
    }

    return(
        <div className={'screen'}>
            <div>
                <table id="board">
                    <tbody>
                    {[...Array(G.numOfRow).keys()].map((row) =>
                        <tr key={row}>
                            {[...Array(G.numOfCol).keys()].map(col => {
                                // TODO: add mode variable for pass and play / opposite play / multiplayer change currentPlayer to playerID for multiplayer
                                let playerRow = reflectRow(G.numOfRow, row, playerID as string)
                                let playerCol = reflectCol(G.numOfCol, col, playerID as string)
                                return <td key={row * G.numOfCol + col}>
                                    <button className={["cell", terrain[playerRow][playerCol], G.cells[playerRow][playerCol], G.selectedPiece?isPossibleMove(G.possibleMovesLookUp[G.selectedPiece],[playerRow,playerCol])?"possibleMove":null:null].join(" ")}
                                            onClick={() => onClick(playerRow*G.numOfCol+playerCol)}></button>
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