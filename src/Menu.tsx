import React from 'react';
import './Menu.css'
import {MenuState} from "./App";

export function Menu({onClick}:{onClick:(arg:number)=>void}){
    return (
        <div className ='App'>
            <div className='welcome-box'>
                <h2>DouShouQi</h2>
                <button className='welcome-button' onClick={() => onClick(MenuState.SinglePlayer)}>Single Player</button>
                <br/>
                <button className='welcome-button' onClick={() => onClick(MenuState.MultiPlayer)}>Multiplayer</button>
            </div>
        </div>
    )
}

export function MultiplyaerMenu({onClick}:{onClick:(arg:number)=>void}){
    return (
        <div className = 'App'>
            <div className='welcome-box'>
                <h2>DouShouQi</h2>
                <button className='welcome-button' onClick={() => onClick(MenuState.LocalPassAndPlay)}>Local pass and play</button>
                <br/>
                <button className='welcome-button' onClick={() => onClick(MenuState.Online1)}>Online Player 1</button>
                <br/>
                <button className='welcome-button' onClick={() => onClick(MenuState.Online2)}>Online Player 2</button>
            </div>
        </div>
    )
}