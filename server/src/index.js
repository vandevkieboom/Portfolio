"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./lib/prisma");
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
    await server.register(jwt_1.default, {
        secret: jwtSecret,
    });
    server.decorate('authenticate', async (request, reply) => {
        try {
            const token = request.cookies.token;
            if (!token) {
                return reply.status(401).send({ message: 'Unauthorized' });
            }
            request.headers['authorization'] = `Bearer ${token}`;
            await request.jwtVerify();
            console.log('Decoded JWT:', request.user);
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
            }, { expiresIn: '1h' });
            reply.setCookie('token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60,
            });
            return reply.send({ message: 'Login successful' });
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.post('/api/logout', async (request, reply) => {
        try {
            reply.clearCookie('token', { path: '/' });
            return { message: 'Logged out' };
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.get('/', async (request, reply) => {
        return reply.send('API is running');
    });
    server.get('/api/user/me', async (request, reply) => {
        try {
            const token = request.cookies.token;
            if (!token) {
                return reply.status(401).send({ message: 'Unauthorized' });
            }
            const decoded = server.jwt.verify(token);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { username: true, role: true },
            });
            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }
            return reply.send(user);
        }
        catch (err) {
            return reply.status(401).send({ message: 'Invalid token' });
        }
    });
    server.get('/api/users', { onRequest: [server.authenticate] }, async (request, reply) => {
        try {
            const users = await prisma_1.prisma.user.findMany();
            if (users.length === 0) {
                return reply.status(404).send({ message: 'No users found' });
            }
            return reply.send(users);
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.get('/api/blogs', async (request, reply) => {
        try {
            const blogs = await prisma_1.prisma.blog.findMany({
                include: {
                    author: {
                        select: {
                            username: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return reply.send(blogs);
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.post('/api/blogs', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { title, content } = request.body;
        try {
            const blog = await prisma_1.prisma.blog.create({
                data: {
                    title,
                    content,
                    authorId: request.user.userId,
                },
                include: {
                    author: {
                        select: {
                            username: true,
                        },
                    },
                },
            });
            return reply.send(blog);
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
