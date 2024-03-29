import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import {DouSHouQi} from "./src/Game";

const server = Server({ games: [DouSHouQi] });
const PORT : number = parseInt(process.env.PORT as string) || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(serve(frontEndAppBuildPath))

server.run(PORT, () => {
    server.app.use(
        async (ctx, next) => await serve(frontEndAppBuildPath)(
            Object.assign(ctx, { path: 'index.html' }),
            next
        )
    )
});
