import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export default async function blogRoutes(server: FastifyInstance) {
  server.get('/api/blogs', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          author: {
            select: { username: true },
          },
        },
        orderBy: { createdAt: 'desc' },
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
              select: { username: true },
            },
          },
        });
        return reply.send(blog);
      } catch (err) {
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );
}
