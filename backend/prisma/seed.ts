import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create test users
  const users = [
    { username: 'alice', password: 'password123' },
    { username: 'bob', password: 'password123' },
    { username: 'charlie', password: 'password123' },
    { username: 'diana', password: 'password123' }
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username }
    });

    if (!existingUser) {
      const hashedPassword = await hashPassword(userData.password);
      await prisma.user.create({
        data: {
          username: userData.username,
          password: hashedPassword
        }
      });
      console.log(`✅ Created user: ${userData.username}`);
    } else {
      console.log(`⚠️  User ${userData.username} already exists`);
    }
  }

  console.log('🌱 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
