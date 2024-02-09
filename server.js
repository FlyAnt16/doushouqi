"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("boardgame.io/server");
const path_1 = __importDefault(require("path"));
const koa_static_1 = __importDefault(require("koa-static"));
const Game_1 = require("./src/Game");
const server = (0, server_1.Server)({ games: [Game_1.DouSHouQi] });
const PORT = parseInt(process.env.PORT) || 8000;
// Build path relative to the server.js file
const frontEndAppBuildPath = path_1.default.resolve(__dirname, './build');
server.app.use((0, koa_static_1.default)(frontEndAppBuildPath));
server.run(PORT, () => {
    server.app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, koa_static_1.default)(frontEndAppBuildPath)(Object.assign(ctx, { path: 'index.html' }), next);
    }));
});
