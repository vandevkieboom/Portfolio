"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = blogRoutes;
const prisma_1 = require("../lib/prisma");
const auth_1 = require("@/middleware/auth");
async function blogRoutes(server) {
    server.get('/api/blogs', async (request, reply) => {
        try {
            const blogs = await prisma_1.prisma.blog.findMany({
                include: {
                    author: {
                        select: { username: true },
                    },
                    tags: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            return reply.send(blogs);
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.get('/api/blogs/:id', async (request, reply) => {
        const { id } = request.params;
        const blogId = parseInt(id, 10);
        try {
            const blog = await prisma_1.prisma.blog.findUnique({
                where: { id: blogId },
                include: {
                    author: {
                        select: { username: true },
                    },
                    tags: true,
                },
            });
            return reply.send(blog);
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.get('/api/blogs/:blogId/comments', async (request, reply) => {
        const { blogId } = request.params;
        try {
            const comments = await prisma_1.prisma.comment.findMany({
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
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.post('/api/blogs', { onRequest: [auth_1.authenticateAdmin] }, async (request, reply) => {
        const { title, content, tags } = request.body;
        try {
            const blog = await prisma_1.prisma.blog.create({
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
        }
        catch (err) {
            console.error('Error creating blog:', err);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.post('/api/blogs/:blogId/comments', { onRequest: [auth_1.authenticateUser] }, async (request, reply) => {
        const { blogId } = request.params;
        const { content } = request.body;
        try {
            const comment = await prisma_1.prisma.comment.create({
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
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    server.delete('/api/comments/:commentId', { onRequest: [auth_1.authenticateUser] }, async (request, reply) => {
        const { commentId } = request.params;
        try {
            const comment = await prisma_1.prisma.comment.findUnique({
                where: { id: parseInt(commentId) },
            });
            if (!comment) {
                return reply.status(404).send({ message: 'Comment not found' });
            }
            if (comment.authorId !== request.user.userId && request.user.role !== 'ADMIN') {
                return reply.status(403).send({ message: 'Unauthorized' });
            }
            await prisma_1.prisma.comment.delete({
                where: { id: parseInt(commentId) },
            });
            return reply.send({ message: 'Comment deleted successfully' });
        }
        catch (err) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
