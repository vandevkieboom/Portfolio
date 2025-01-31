"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./lib/prisma");
dotenv_1.default.config();
const buildServer = async () => {
    const server = (0, fastify_1.default)({ logger: true });
    await server.register(cors_1.default, {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    });
    await server.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
    });
    server.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: request.user.userId },
            });
            if (!user || user.role !== 'ADMIN') {
                return reply.status(403).send({ message: 'Admin access required' });
            }
        }
        catch (err) {
            reply.send(err);
        }
    });
    server.post('/api/login', async (request, reply) => {
        const { username, password } = request.body;
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { username },
            });
            if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }
            const token = await reply.jwtSign({
                userId: user.id,
                role: user.role,
            });
            return { token };
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.get('/api/user/:id', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { id } = request.params;
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: Number(id) },
            });
            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }
            return user;
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
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
