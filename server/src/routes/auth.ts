import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export default async function authRoutes(server: FastifyInstance) {
  server.post('/api/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as { username: string; password: string };

    try {
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }

      const token = await reply.jwtSign({ userId: user.id, role: user.role }, { expiresIn: '1h' });

      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60,
      });

      return reply.send({ message: 'Login successful' });
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.post('/api/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      reply.clearCookie('token', {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
      });
      return { message: 'Logged out' };
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}
