"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.authenticateAdmin = authenticateAdmin;
const prisma_1 = require("../lib/prisma");
async function authenticateUser(request, reply) {
    try {
        const token = request.cookies.token;
        if (!token) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        request.headers['authorization'] = `Bearer ${token}`;
        await request.jwtVerify();
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: request.user.userId },
        });
        if (!user) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        request.user = { userId: user.id, role: user.role };
    }
    catch (err) {
        reply.send(err);
    }
}
async function authenticateAdmin(request, reply) {
    try {
        await authenticateUser(request, reply);
        if (request.user.role !== 'ADMIN') {
            return reply.status(403).send({ message: 'Admin access required' });
        }
    }
    catch (err) {
        reply.send(err);
    }
}
