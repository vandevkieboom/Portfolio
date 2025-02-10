import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = request.cookies.token;
    if (!token) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    request.headers['authorization'] = `Bearer ${token}`;
    await request.jwtVerify();

    const user = await prisma.user.findUnique({
      where: { id: request.user.userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Admin access required' });
    }
  } catch (err) {
    reply.send(err);
  }
}
