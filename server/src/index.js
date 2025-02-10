"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
const auth_2 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const blog_1 = __importDefault(require("./routes/blog"));
dotenv_1.default.config();
const buildServer = async () => {
    const server = (0, fastify_1.default)({ logger: true });
    await server.register(cookie_1.default);
    await server.register(cors_1.default, {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in the environment variables');
        process.exit(1);
    }
    await server.register(jwt_1.default, { secret: jwtSecret });
    server.decorate('authenticate', auth_1.authenticate);
    await server.register(auth_2.default);
    await server.register(user_1.default);
    await server.register(blog_1.default);
    server.get('/', async (request, reply) => {
        return reply.send('API is running');
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
