import './App.css';
import {DouSHouQi} from "./Game";
import {Client} from 'boardgame.io/react'
import {Board} from "./Board";
import {initialiseSettings, randomPieceSetting} from "./Customise";

const TicTacToeClient = Client({
    game: DouSHouQi,
    board: Board,
})

function defaultSetting(){
    initialiseSettings()
}

function App(){
    randomPieceSetting()
    return <TicTacToeClient />
}

export default App;
