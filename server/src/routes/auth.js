"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
async function authRoutes(server) {
    server.post('/api/login', async (request, reply) => {
        const { username, password } = request.body;
        try {
            const user = await prisma_1.prisma.user.findUnique({ where: { username } });
            if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }
            const token = await reply.jwtSign({ userId: user.id, role: user.role }, { expiresIn: '1h' });
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
            reply.clearCookie('token', {
                path: '/',
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
            });
            return { message: 'Logged out' };
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
