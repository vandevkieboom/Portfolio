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

  server.post('/api/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, email, password, firstName, lastName } = request.body as {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

    try {
      const existingUsername = await prisma.user.findUnique({ where: { username } });
      if (existingUsername) {
        return reply.status(400).send({ message: 'Username already taken' });
      }

      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return reply.status(400).send({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });

      const token = await reply.jwtSign({ userId: user.id, role: user.role }, { expiresIn: '1h' });

      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60,
      });

      return reply.status(201).send({ message: 'Registration successful' });
    } catch (err) {
      console.error('Registration error:', err);
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
