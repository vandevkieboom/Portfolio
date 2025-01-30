"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const seed = async () => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminUsername || !adminPassword) {
        console.error('ADMIN_USERNAME or ADMIN_PASSWORD is not defined in the environment variables');
        process.exit(1);
    }
    const existingAdmin = await prisma.user.findUnique({
        where: { username: adminUsername },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
        await prisma.user.create({
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
    await prisma.$disconnect();
});
