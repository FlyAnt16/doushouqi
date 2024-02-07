"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplyaerMenu = exports.Menu = void 0;
const react_1 = __importDefault(require("react"));
require("./Menu.css");
const App_1 = require("./App");
function Menu({ onClick }) {
    return (react_1.default.createElement("div", { className: 'App' },
        react_1.default.createElement("div", { className: 'welcome-box' },
            react_1.default.createElement("h2", null, "DouShouQi"),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick(App_1.MenuState.SinglePlayer) }, "Single Player"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick(App_1.MenuState.MultiPlayer) }, "Multiplayer"))));
}
exports.Menu = Menu;
function MultiplyaerMenu({ onClick }) {
    return (react_1.default.createElement("div", { className: 'App' },
        react_1.default.createElement("div", { className: 'welcome-box' },
            react_1.default.createElement("h2", null, "DouShouQi"),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick(App_1.MenuState.LocalPassAndPlay) }, "Local pass and play"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick(App_1.MenuState.Online1) }, "Online Player 1"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick(App_1.MenuState.Online2) }, "Online Player 2"))));
}
exports.MultiplyaerMenu = MultiplyaerMenu;
