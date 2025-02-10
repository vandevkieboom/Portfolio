import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';

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

  await server.register(fastifyJWT, { secret: jwtSecret });
  server.decorate('authenticate', authenticate);

  await server.register(authRoutes);
  await server.register(userRoutes);
  await server.register(blogRoutes);

  server.get('/', async (request, reply) => {
    return reply.send('API is running');
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
