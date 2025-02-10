"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const prisma_1 = require("../lib/prisma");
async function userRoutes(server) {
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
}
