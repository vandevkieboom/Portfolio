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
    if (!userUsername || !userPassword) {
        console.error('USER_USERNAME or USER_PASSWORD is not defined in the environment variables');
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
                password: hashedPassword,
                role: 'USER',
            },
        });
        console.log('Normal user created');
    }
    else {
        console.log('Normal user already exists');
    }
    if (!adminUsername || !adminPassword) {
        console.error('ADMIN_USERNAME or ADMIN_PASSWORD is not defined in the environment variables');
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
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('Admin user created');
    }
    else {
        console.log('Admin user already exists');
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
