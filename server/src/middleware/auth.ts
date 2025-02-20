import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
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

    if (!user) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    request.user = { userId: user.id, role: user.role };
  } catch (err) {
    reply.send(err);
  }
}

export async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await authenticateUser(request, reply);

    if (request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Admin access required' });
    }
  } catch (err) {
    reply.send(err);
  }
}
