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

  server.get(
    '/api/blogs/:id',
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      console.log('Request params:', request.params); // Debug log
      const { id } = request.params;

      try {
        const blogId = parseInt(id);

        if (isNaN(blogId)) {
          return reply.status(400).send({ message: 'Invalid blog ID' });
        }

        const blog = await prisma.blog.findUnique({
          where: { id: blogId },
          include: {
            author: {
              select: { username: true },
            },
          },
        });

        if (!blog) {
          return reply.status(404).send({ message: 'Blog not found' });
        }

        return reply.send(blog);
      } catch (err) {
        console.error('Error fetching blog:', err); // Debug log
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );
}
