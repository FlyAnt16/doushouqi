"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const react_1 = __importDefault(require("react"));
require("./Board.css");
const Customise_1 = require("./Customise");
const Game_1 = require("./Game");
const elephant0_png_1 = __importDefault(require("./images/elephant0.png"));
const lion0_png_1 = __importDefault(require("./images/lion0.png"));
const tiger0_png_1 = __importDefault(require("./images/tiger0.png"));
const panther0_png_1 = __importDefault(require("./images/panther0.png"));
const wolf0_png_1 = __importDefault(require("./images/wolf0.png"));
const dog0_png_1 = __importDefault(require("./images/dog0.png"));
const cat0_png_1 = __importDefault(require("./images/cat0.png"));
const rat0_png_1 = __importDefault(require("./images/rat0.png"));
function Board({ ctx, G, moves }) {
    const onClick = (id) => {
        let row = Math.floor(id / Customise_1.NUMOFCOL);
        let col = id - row * Customise_1.NUMOFCOL;
        return moves.onClick(row, col);
    };
    let possibleMoves = [];
    if (G.selectedPiece && (G.selectedRow !== null) && (G.selectedCol !== null))
        possibleMoves = (0, Game_1.getPossibleMoves)(G.cells, G.pieces, G.selectedPiece, [G.selectedRow, G.selectedCol]);
    let possibleMovesBoard = (0, Customise_1.createNullBoard)();
    possibleMoves.forEach(([row, col]) => possibleMovesBoard[row][col] = 'possibleMove');
    let tbody = [];
    for (let i = 0; i < Customise_1.NUMOFROW; i++) {
        let cells = [];
        for (let j = 0; j < Customise_1.NUMOFCOL; j++) {
            const id = Customise_1.NUMOFCOL * i + j;
            cells.push(react_1.default.createElement("td", { key: id },
                react_1.default.createElement("button", { className: ["cell", Customise_1.TERRAIN[i][j], G.cells[i][j], possibleMovesBoard[i][j]].join(" "), onClick: () => onClick(id) })));
        }
        tbody.push(react_1.default.createElement("tr", { key: i }, cells));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", null,
            react_1.default.createElement("table", { id: "board" },
                react_1.default.createElement("tbody", null, tbody))),
        react_1.default.createElement("div", { className: 'pieceOrder' },
            "Piece order:",
            react_1.default.createElement("img", { alt: 'elephant', width: '40px', height: '40px', src: elephant0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'lion', width: '40px', height: '40px', src: lion0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'tiger', width: '40px', height: '40px', src: tiger0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'panther', width: '40px', height: '40px', src: panther0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'wolf', width: '40px', height: '40px', src: wolf0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'dog', width: '40px', height: '40px', src: dog0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'cat', width: '40px', height: '40px', src: cat0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'rat', width: '40px', height: '40px', src: rat0_png_1.default }),
            '>',
            react_1.default.createElement("img", { alt: 'elephant', width: '40px', height: '40px', src: elephant0_png_1.default }))));
}
exports.Board = Board;
