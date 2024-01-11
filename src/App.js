"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
const Game_1 = require("./Game");
const react_1 = require("boardgame.io/react");
const Board_1 = require("./Board");
const Customise_1 = require("./Customise");
const multiplayer_1 = require("boardgame.io/multiplayer");
const react_2 = require("react");
const Welcome_1 = require("./Welcome");
const react_3 = __importDefault(require("react"));
const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
const DouShouQiClient = (0, react_1.Client)({
    game: Game_1.DouSHouQi,
    board: Board_1.Board,
    multiplayer: (0, multiplayer_1.SocketIO)({ server }),
});
const DouShouQiSingle = (0, react_1.Client)({
    game: Game_1.DouSHouQi,
    board: Board_1.Board,
});
function App() {
    const [page, setPage] = (0, react_2.useState)('Welcome');
    function onClick(id) {
        setPage('Game' + id);
    }
    switch (page) {
        case 'Welcome':
            (0, Customise_1.initialiseSettings)();
            return react_3.default.createElement(Welcome_1.WelcomePage, { onClick: onClick });
        case 'Game':
            return react_3.default.createElement(DouShouQiSingle, null);
        case 'Game0':
            return react_3.default.createElement(DouShouQiClient, { matchID: "0", playerID: "0" });
        case 'Game1':
            return react_3.default.createElement(DouShouQiClient, { matchID: "0", playerID: "1" });
        default:
            return react_3.default.createElement(Welcome_1.WelcomePage, { onClick: onClick });
    }
}
exports.default = App;
