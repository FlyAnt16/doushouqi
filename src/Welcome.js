"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomePage = void 0;
const react_1 = __importDefault(require("react"));
require("./Welcome.css");
function WelcomePage({ onClick }) {
    return (react_1.default.createElement("div", { className: 'App' },
        react_1.default.createElement("div", { className: 'welcome-box' },
            react_1.default.createElement("h2", null, " DouShouQi"),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick('') }, "Single Player"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick('0') }, "Player1"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("button", { className: 'welcome-button', onClick: () => onClick('1') }, "Player2"))));
}
exports.WelcomePage = WelcomePage;
