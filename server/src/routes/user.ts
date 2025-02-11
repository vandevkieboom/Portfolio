import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export default async function userRoutes(server: FastifyInstance) {
  server.get('/api/user/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.cookies.token;
      console.log(token);
      if (!token) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const decoded = server.jwt.verify<{ userId: number; role: string }>(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { username: true, role: true },
      });

      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return reply.send(user);
    } catch (err) {
      return reply.status(401).send({ message: 'Invalid token' });
    }
  });

  server.get(
    '/api/users',
    { onRequest: [server.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const users = await prisma.user.findMany();
        if (users.length === 0) {
          return reply.status(404).send({ message: 'No users found' });
        }
        return reply.send(users);
      } catch (err) {
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );
}
