"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const buildServer = async () => {
    const server = (0, fastify_1.default)({ logger: true });
    server.get('/', async () => {
        return { hello: 'worlds' };
    });
    return server;
};
const startServer = async () => {
    try {
        const server = await buildServer();
        const port = process.env.PORT ? Number(process.env.PORT) : 8080;
        await server.listen({ port });
        console.log(`Server running on port ${port}`);
        process.on('SIGINT', async () => {
            await server.close();
            console.log('Server shut down gracefully');
            process.exit(0);
        });
    }
    catch (err) {
        console.error('Error starting the server:', err instanceof Error ? err.message : err);
        process.exit(1);
    }
};
startServer();
