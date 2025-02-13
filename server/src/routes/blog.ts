import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

  server.get('/api/blogs/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const blogId = parseInt(id, 10);
    try {
      const blog = await prisma.blog.findUnique({
        where: { id: blogId },
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
  });

  server.post(
    '/api/blogs',
    { onRequest: [server.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { title, content } = request.body as { title: string; content: string };

      const base64Images = content.match(/<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"/g);

      if (base64Images) {
        for (const img of base64Images) {
          const base64Data = img.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');

          if (buffer.length > MAX_IMAGE_SIZE) {
            return reply.status(400).send({ message: 'Image is too large. Max size is 5MB.' });
          }
        }
      }

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
