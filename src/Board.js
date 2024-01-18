"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const react_1 = __importStar(require("react"));
require("./Board.css");
const elephant0_png_1 = __importDefault(require("./images/elephant0.png"));
const lion0_png_1 = __importDefault(require("./images/lion0.png"));
const tiger0_png_1 = __importDefault(require("./images/tiger0.png"));
const panther0_png_1 = __importDefault(require("./images/panther0.png"));
const wolf0_png_1 = __importDefault(require("./images/wolf0.png"));
const dog0_png_1 = __importDefault(require("./images/dog0.png"));
const cat0_png_1 = __importDefault(require("./images/cat0.png"));
const rat0_png_1 = __importDefault(require("./images/rat0.png"));
const setup_1 = require("./setup");
const reflectRow = (numOfRow, row, playerID) => playerID === '0' ? row : numOfRow - 1 - row;
const reflectCol = (numOfCol, col, playerID) => playerID === '0' ? col : numOfCol - 1 - col;
function initialiseTerrain(numOfRow, numOfCol, traps, dens, rivers) {
    let board = (0, setup_1.createNullBoard)(numOfRow, numOfCol);
    rivers.forEach(([row, col]) => board[row][col] = 'river');
    traps[0].forEach(([row, col]) => board[row][col] = 'trap0');
    traps[1].forEach(([row, col]) => board[row][col] = 'trap1');
    dens[0].forEach(([row, col]) => board[row][col] = 'den0');
    dens[1].forEach(([row, col]) => board[row][col] = 'den1');
    return board;
}
const isPossibleMove = (possibleMoves, [row, col]) => possibleMoves.some(a => (a[0] === row && a[1] === col));
function Board({ ctx, G, moves, playerID }) {
    const terrain = (0, react_1.useMemo)(() => initialiseTerrain(G.numOfRow, G.numOfCol, G.traps, G.dens, G.rivers), [G.numOfRow, G.numOfCol, G.traps, G.dens, G.rivers]);
    const onClick = (id) => {
        let row = Math.floor(id / G.numOfCol);
        let col = id - row * G.numOfCol;
        return moves.onClick(row, col);
    };
    return (react_1.default.createElement("div", { className: 'screen' },
        react_1.default.createElement("div", null,
            react_1.default.createElement("table", { id: "board" },
                react_1.default.createElement("tbody", null, [...Array(G.numOfRow).keys()].map((row) => react_1.default.createElement("tr", { key: row }, [...Array(G.numOfCol).keys()].map(col => {
                    // TODO: add mode variable for pass and play / opposite play / multiplayer change currentPlayer to playerID for multiplayer
                    // let playerRow = reflectRow(G.numOfRow, row, playerID as string)
                    // let playerCol = reflectCol(G.numOfCol, col, playerID as string)
                    let playerRow = row;
                    let playerCol = col;
                    return react_1.default.createElement("td", { key: row * G.numOfCol + col },
                        react_1.default.createElement("button", { className: ["cell", terrain[playerRow][playerCol], G.cells[playerRow][playerCol], G.selectedPiece ? isPossibleMove(G.possibleMovesLookUp[G.selectedPiece], [playerRow, playerCol]) ? "possibleMove" : null : null].join(" "), onClick: () => onClick(playerRow * G.numOfCol + playerCol) }));
                })))))),
        react_1.default.createElement("div", { className: 'pieceOrder' },
            "Piece order:",
            react_1.default.createElement("img", { alt: 'elephant', width: '40px', height: '40px', src: elephant0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'lion', width: '40px', height: '40px', src: lion0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'tiger', width: '40px', height: '40px', src: tiger0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'panther', width: '40px', height: '40px', src: panther0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'wolf', width: '40px', height: '40px', src: wolf0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'dog', width: '40px', height: '40px', src: dog0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'cat', width: '40px', height: '40px', src: cat0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'rat', width: '40px', height: '40px', src: rat0_png_1.default }),
            ">",
            react_1.default.createElement("img", { alt: 'elephant', width: '40px', height: '40px', src: elephant0_png_1.default }))));
}
exports.Board = Board;
