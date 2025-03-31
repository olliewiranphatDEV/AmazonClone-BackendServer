const prisma = require('../models')

async function resetDB() {
    try {
        // Drop and recreate the database
        await prisma.$executeRawUnsafe('DROP DATABASE `centric`');
        await prisma.$executeRawUnsafe('CREATE DATABASE `centric`');
        console.log("Database reset successfully!");
    } catch (error) {
        console.error("Error resetting the database:", error);
    } finally {
        // Disconnect Prisma client
        await prisma.$disconnect();
    }
}

console.log("Resetting DB...");
resetDB(); //npm prisma resetDB

// "scripts": {
//     "dev": "nodemon server.js",
//     "start": "nodemon server.js",
//     "resetDB": "node prisma/resetDB.js"
//   }