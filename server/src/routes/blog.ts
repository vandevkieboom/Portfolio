import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { authenticateAdmin, authenticateUser } from '../middleware/auth';

export default async function blogRoutes(server: FastifyInstance) {
  server.get('/api/blogs', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          author: {
            select: { username: true },
          },
          tags: true,
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
          tags: true,
        },
      });
      return reply.send(blog);
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.get('/api/blogs/:blogId/comments', async (request: FastifyRequest, reply: FastifyReply) => {
    const { blogId } = request.params as { blogId: string };

    try {
      const comments = await prisma.comment.findMany({
        where: { blogId: parseInt(blogId) },
        include: {
          author: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send(comments);
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  server.post(
    '/api/blogs',
    { onRequest: [authenticateAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { title, content, tags } = request.body as {
        title: string;
        content: string;
        tags: string[];
      };

      try {
        const blog = await prisma.blog.create({
          data: {
            title,
            content,
            authorId: request.user.userId,
            tags: {
              connectOrCreate: tags.map((tagName) => ({
                where: { name: tagName },
                create: { name: tagName },
              })),
            },
          },
          include: {
            author: {
              select: { username: true },
            },
            tags: true,
          },
        });
        return reply.send(blog);
      } catch (err) {
        console.error('Error creating blog:', err);
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  server.post(
    '/api/blogs/:blogId/comments',
    { onRequest: [authenticateUser] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { blogId } = request.params as { blogId: string };
      const { content } = request.body as { content: string };

      try {
        const comment = await prisma.comment.create({
          data: {
            content,
            authorId: request.user.userId,
            blogId: parseInt(blogId),
          },
          include: {
            author: {
              select: {
                username: true,
                avatarUrl: true,
              },
            },
          },
        });

        return reply.status(201).send(comment);
      } catch (err) {
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  server.delete(
    '/api/comments/:commentId',
    { onRequest: [authenticateUser] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { commentId } = request.params as { commentId: string };

      try {
        const comment = await prisma.comment.findUnique({
          where: { id: parseInt(commentId) },
        });

        if (!comment) {
          return reply.status(404).send({ message: 'Comment not found' });
        }

        if (comment.authorId !== request.user.userId && request.user.role !== 'ADMIN') {
          return reply.status(403).send({ message: 'Unauthorized' });
        }

        await prisma.comment.delete({
          where: { id: parseInt(commentId) },
        });

        return reply.send({ message: 'Comment deleted successfully' });
      } catch (err) {
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );
}
