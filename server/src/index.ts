import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';

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

let app: FastifyInstance;

const init = async () => {
  if (app) return app;

  app = Fastify({
    logger: true,
    disableRequestLogging: process.env.NODE_ENV === 'production',
    bodyLimit: 5 * 1024 * 1024,
  });

  try {
    await app.register(fastifyCookie);
    await app.register(fastifyCors, {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    await app.register(fastifyJWT, { secret: jwtSecret });
    app.decorate('authenticate', authenticate);

    await app.register(authRoutes);
    await app.register(userRoutes);
    await app.register(blogRoutes);

    app.get('/', async (request, reply) => {
      return reply.send('API is running');
    });

    app.get('/api/health', async () => {
      return { status: 'ok' };
    });

    await app.ready();
    return app;
  } catch (err) {
    console.error('Error initializing server:', err);
    throw err;
  }
};

export default async (req: any, res: any) => {
  try {
    const server = await init();
    await server.ready();

    server.server.emit('request', req, res);
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send('Internal Server Error');
  }
};

if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      const server = await init();
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
}
