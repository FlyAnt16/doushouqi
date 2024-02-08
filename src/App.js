"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuState = void 0;
require("./App.css");
const Game_1 = require("./Game");
const react_1 = require("boardgame.io/react");
const Board_1 = require("./Board");
const multiplayer_1 = require("boardgame.io/multiplayer");
const react_2 = require("react");
const Menu_1 = require("./Menu");
const react_3 = __importDefault(require("react"));
const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
const DouShouQiClient = (0, react_1.Client)({
    game: Game_1.DouSHouQi,
    board: Board_1.Board,
    multiplayer: (0, multiplayer_1.SocketIO)({ server }),
});
const DouShouQi = (0, react_1.Client)({
    game: Game_1.DouSHouQi,
    board: Board_1.Board,
});
const DouShouQiSingle = (0, react_1.Client)({
    game: Game_1.DouSHouQiSinglePlayer,
    board: Board_1.Board,
    numPlayers: 1,
});
var MenuState;
(function (MenuState) {
    MenuState[MenuState["Menu"] = 0] = "Menu";
    MenuState[MenuState["SinglePlayer"] = 1] = "SinglePlayer";
    MenuState[MenuState["MultiPlayer"] = 2] = "MultiPlayer";
    MenuState[MenuState["Online1"] = 3] = "Online1";
    MenuState[MenuState["Online2"] = 4] = "Online2";
    MenuState[MenuState["LocalPassAndPlay"] = 5] = "LocalPassAndPlay";
})(MenuState || (exports.MenuState = MenuState = {}));
function App() {
    const [page, setPage] = (0, react_2.useState)(MenuState.Menu);
    function onClick(state) {
        setPage(state);
    }
    // TODO: use Lobby to create match that  allows setup data to be passed for random board setup
    switch (page) {
        case MenuState.Menu:
            return react_3.default.createElement(Menu_1.Menu, { onClick: onClick });
        case MenuState.SinglePlayer:
            return react_3.default.createElement(DouShouQiSingle, null);
        case MenuState.MultiPlayer:
            return react_3.default.createElement(Menu_1.MultiplyaerMenu, { onClick: onClick });
        case MenuState.Online1:
            return react_3.default.createElement(DouShouQiClient, { matchID: "0", playerID: "0" });
        case MenuState.Online2:
            return react_3.default.createElement(DouShouQiClient, { matchID: "0", playerID: "1" });
        case MenuState.LocalPassAndPlay:
            return react_3.default.createElement(DouShouQi, null);
        default:
            return react_3.default.createElement(Menu_1.Menu, { onClick: onClick });
    }
}
exports.default = App;
