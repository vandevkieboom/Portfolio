import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';

dotenv.config();

const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({ logger: true });

  await server.register(fastifyCors, {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  server.get('/api/user/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return user;
    } catch (error) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

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
