import logo from './logo.svg';
import './App.css';
import {DouSHouQi} from "./Game";
import {Client} from 'boardgame.io/react'
import {Board} from "./Board";

const App = Client({
    game: DouSHouQi,
    board: Board,
})

export default App;
