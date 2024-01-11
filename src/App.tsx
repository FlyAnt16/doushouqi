import './App.css';
import {DouSHouQi} from "./Game";
import {Client} from 'boardgame.io/react'
import {Board} from "./Board";
import {initialiseSettings, randomPieceSetting} from "./Customise";
import {SocketIO} from "boardgame.io/multiplayer";
import {useState} from "react";
import {WelcomePage} from "./Welcome";
import React from 'react';

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;

const DouShouQiClient = Client({
    game: DouSHouQi,
    board: Board,
    multiplayer: SocketIO({ server }),
})

const DouShouQiSingle = Client({
    game: DouSHouQi,
    board: Board,
})

function App(){
    const [page, setPage] = useState('Welcome')
    function onClick(id:string){
        setPage('Game'+id)
    }

    switch (page){
        case 'Welcome' :
            initialiseSettings()
            return <WelcomePage onClick={onClick}/>;
        case 'Game':
            return <DouShouQiSingle />
        case 'Game0':
            return <DouShouQiClient matchID="0" playerID="0"/>;
        case 'Game1':
            return <DouShouQiClient matchID="0" playerID="1"/>
        default:
            return <WelcomePage onClick={onClick} />
    }
}

export default App;
