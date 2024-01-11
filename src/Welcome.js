"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomePage = void 0;
const react_1 = __importDefault(require("react"));
function WelcomePage({ onClick }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("button", { onClick: () => onClick('') }, "Single Player"),
        react_1.default.createElement("button", { onClick: () => onClick('0') }, "Player1"),
        react_1.default.createElement("button", { onClick: () => onClick('1') }, "Player2")));
}
exports.WelcomePage = WelcomePage;
