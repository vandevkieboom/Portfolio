"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = blogRoutes;
const prisma_1 = require("../lib/prisma");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
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
    server.post('/api/blogs', { onRequest: [server.authenticate] }, async (request, reply) => {
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
}
