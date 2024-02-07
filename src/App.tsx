import './App.css';
import {DouSHouQi, DouSHouQiSinglePlayer} from "./Game";
import {Client} from 'boardgame.io/react'
import {Board} from "./Board";
import {SocketIO} from "boardgame.io/multiplayer";
import {useState} from "react";
import {Menu, MultiplyaerMenu} from "./Menu";
import React from 'react';

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;

const DouShouQiClient = Client({
    game: DouSHouQi,
    board: Board,
    multiplayer: SocketIO({ server }),
})

const DouShouQi = Client({
    game: DouSHouQi,
    board: Board,
})

const DouShouQiSingle = Client({
    game: DouSHouQiSinglePlayer,
    board: Board,
})

export enum MenuState {
    Menu = 0,
    SinglePlayer = 1,
    MultiPlayer = 2,
    Online1 = 3,
    Online2 = 4,
    LocalPassAndPlay = 5,
}

function App(){
    const [page, setPage] = useState(MenuState.Menu)

    function onClick(state:number){
        setPage(state as MenuState)
    }

    switch (page){
        case MenuState.Menu:
            return <Menu onClick={onClick}/>;
        case MenuState.SinglePlayer:
            return <DouShouQiSingle />
        case MenuState.MultiPlayer:
            return <MultiplyaerMenu onClick={onClick}/>
        case MenuState.Online1:
            return <DouShouQiClient matchID="0" playerID="0"/>;
        case MenuState.Online2:
            return <DouShouQiClient matchID="0" playerID="1"/>
        case MenuState.LocalPassAndPlay:
            return <DouShouQi />
        default:
            return <Menu onClick={onClick} />
    }
}

export default App;
