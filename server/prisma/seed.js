"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seed = async () => {
    const userUsername = process.env.USER_USERNAME;
    const userPassword = process.env.USER_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const userEmail = process.env.USER_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminUsername || !adminPassword || !adminEmail) {
        console.error('ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_EMAIL is not defined in the environment variables');
        process.exit(1);
    }
    const existingAdmin = await prisma_1.prisma.user.findUnique({
        where: { username: adminUsername },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
        await prisma_1.prisma.user.create({
            data: {
                username: adminUsername,
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Jordy',
                lastName: 'Van Den Kieboom',
                bio: 'I’m Jordy Van Den Kieboom, a passionate developer focused on building innovative software and creating impactful solutions.', // Your bio
                role: 'ADMIN',
            },
        });
        console.log('Admin user created');
    }
    else {
        console.log('Admin user already exists');
    }
    if (!userUsername || !userPassword || !userEmail) {
        console.error('USER_USERNAME, USER_PASSWORD, or USER_EMAIL is not defined in the environment variables');
        process.exit(1);
    }
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { username: userUsername },
    });
    if (!existingUser) {
        const hashedPassword = await bcryptjs_1.default.hash(userPassword, 10);
        await prisma_1.prisma.user.create({
            data: {
                username: userUsername,
                email: userEmail,
                password: hashedPassword,
                firstName: 'Elon',
                lastName: 'Musk',
                bio: 'I’m Elon Musk, the CEO of SpaceX and Tesla, focusing on innovations in space travel, electric vehicles, and sustainable energy.',
                role: 'USER',
            },
        });
        console.log('Normal user created');
    }
    else {
        console.log('Normal user already exists');
    }
};
seed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
