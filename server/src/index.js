"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const auth_1 = require("./middleware/auth");
const auth_2 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const blog_1 = __importDefault(require("./routes/blog"));
let app;
const init = async () => {
    if (app)
        return app;
    app = (0, fastify_1.default)({
        logger: true,
        disableRequestLogging: process.env.NODE_ENV === 'production',
    });
    try {
        await app.register(cookie_1.default);
        await app.register(cors_1.default, {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            credentials: true,
        });
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        await app.register(jwt_1.default, { secret: jwtSecret });
        app.decorate('authenticate', auth_1.authenticate);
        await app.register(auth_2.default);
        await app.register(user_1.default);
        await app.register(blog_1.default);
        app.get('/', async (request, reply) => {
            return reply.send('API is running');
        });
        app.get('/api/health', async () => {
            return { status: 'ok' };
        });
        await app.ready();
        return app;
    }
    catch (err) {
        console.error('Error initializing server:', err);
        throw err;
    }
};
exports.default = async (req, res) => {
    try {
        const server = await init();
        await server.ready();
        server.server.emit('request', req, res);
    }
    catch (err) {
        console.error('Error handling request:', err);
        res.status(500).send('Internal Server Error');
    }
};
if (process.env.NODE_ENV !== 'production') {
    const startServer = async () => {
        try {
            const server = await init();
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
}
