import React from 'react';
import './Welcome.css'

export function WelcomePage({onClick} : {onClick: (arg:string)=>void}){
    return (
        <div className='App'>
            <div className='welcome-box'>
            <h2> DouShouQi</h2>
            <button className='welcome-button' onClick={() => onClick('')}>Single Player</button><br/>
            <button className='welcome-button' onClick={() => onClick('0')}>Player1</button><br/>
            <button className='welcome-button' onClick={() => onClick('1')}>Player2</button>
            </div>
        </div>
    )
}