"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const prisma_1 = require("../lib/prisma");
async function authenticate(request, reply) {
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
        if (!user || user.role !== 'ADMIN') {
            return reply.status(403).send({ message: 'Admin access required' });
        }
    }
    catch (err) {
        reply.send(err);
    }
}
