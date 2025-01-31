import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';

dotenv.config();

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: number; role: string };
    user: { userId: number; role: string };
  }
}

const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({ logger: true });

  await server.register(fastifyCookie);

  await server.register(fastifyCors, {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in the environment variables');
    process.exit(1);
  }

  await server.register(fastifyJWT, {
    secret: jwtSecret,
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const token = request.cookies.token;
      if (!token) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      request.headers['authorization'] = `Bearer ${token}`;

      await request.jwtVerify();

      console.log('Decoded JWT:', request.user);

      const user = await prisma.user.findUnique({
        where: { id: request.user.userId },
      });

      if (!user || user.role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Admin access required' });
      }
    } catch (err) {
      reply.send(err);
    }
  });

  server.post('/api/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as { username: string; password: string };

    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }

      const token = await reply.jwtSign(
        {
          userId: user.id,
          role: user.role,
        },
        { expiresIn: '1h' }
      );

      return { token };
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.get(
    '/api/user/:id',
    { onRequest: [server.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
        });

        if (!user) {
          return reply.status(404).send({ message: 'User not found' });
        }

        return user;
      } catch (err) {
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  return server;
};

const startServer = async (): Promise<void> => {
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
  } catch (err) {
    console.error('Error starting the server:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

startServer();
