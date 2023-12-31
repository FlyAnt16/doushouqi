import logo from './logo.svg';
import './App.css';
import {DouSHouQi} from "./Game";
import {Client} from 'boardgame.io/react'

const App = Client({
    game: DouSHouQi,
})

export default App;
