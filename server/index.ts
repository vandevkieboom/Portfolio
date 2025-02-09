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

      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
      });

      return reply.send({ message: 'Login successful' });
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.post('/api/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      reply.clearCookie('token', { path: '/' });
      return { message: 'Logged out' };
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.get('/api/user/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.cookies.token;
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

  server.get('/api/blogs', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return reply.send(blogs);
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.post(
    '/api/blogs',
    { onRequest: [server.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { title, content } = request.body as { title: string; content: string };

      try {
        const blog = await prisma.blog.create({
          data: {
            title,
            content,
            authorId: request.user.userId,
          },
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
        });
        return reply.send(blog);
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
