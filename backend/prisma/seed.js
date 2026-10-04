const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding RateMyStore database...');

  // Clean existing data
  await prisma.rating.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = 'Password@123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Create System Administrator
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Account', // 28 chars (min 20, max 60)
      email: 'admin@ratemystore.com',
      passwordHash: hashedPassword,
      address: '100 Admin Plaza, Suite 900, Central City, CA 90001',
      role: 'ADMIN',
    },
  });
  console.log(`Created Admin user: ${admin.email}`);

  // 2. Create Store Owner
  const owner = await prisma.user.create({
    data: {
      name: 'Store Owner Account Official', // 28 chars
      email: 'owner@ratemystore.com',
      passwordHash: hashedPassword,
      address: '200 Retail Avenue, Commercial Hub, CA 90002',
      role: 'STORE_OWNER',
    },
  });
  console.log(`Created Store Owner user: ${owner.email}`);

  // 3. Create Store owned by Store Owner
  const store1 = await prisma.store.create({
    data: {
      name: 'Supertech Electronics Store',
      email: 'contact@supertechelectronics.com',
      address: '500 Innovation Boulevard, Tech Park, CA 90003',
      ownerId: owner.id,
    },
  });
  console.log(`Created Store: ${store1.name} (Owner ID: ${owner.id})`);

  // Create another store for testing multiple stores
  const store2 = await prisma.store.create({
    data: {
      name: 'Fresh Harvest Grocery Market',
      email: 'info@freshharvestmarket.com',
      address: '789 Farmers Market Way, Green Valley, CA 90004',
      ownerId: owner.id,
    },
  });
  console.log(`Created Store: ${store2.name}`);

  // 4. Create Normal Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Normal User Johnathan Doe', // 24 chars
      email: 'johnathan.doe@example.com',
      passwordHash: hashedPassword,
      address: '12 Pine Street, Apartment 4B, Springfield, IL 62701',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Normal User Jane Smith Jr', // 24 chars
      email: 'jane.smith@example.com',
      passwordHash: hashedPassword,
      address: '45 Oak Drive, Suburbia Heights, Austin, TX 78701',
      role: 'USER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Normal User Alice Johnson', // 24 chars
      email: 'alice.johnson@example.com',
      passwordHash: hashedPassword,
      address: '88 Maple Lane, Downtown District, Seattle, WA 98101',
      role: 'USER',
    },
  });

  console.log('Created normal users:', user1.email, user2.email, user3.email);

  // 5. Create Sample Ratings
  await prisma.rating.create({
    data: {
      userId: user1.id,
      storeId: store1.id,
      rating: 5,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user2.id,
      storeId: store1.id,
      rating: 4,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user3.id,
      storeId: store1.id,
      rating: 3,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user1.id,
      storeId: store2.id,
      rating: 4,
    },
  });

  console.log('Seeded sample store ratings successfully.');

  console.log('\n--- SEED CREDENTIALS ---');
  console.log('Admin: admin@ratemystore.com / Password@123');
  console.log('Store Owner: owner@ratemystore.com / Password@123');
  console.log('User 1: johnathan.doe@example.com / Password@123');
  console.log('User 2: jane.smith@example.com / Password@123');
  console.log('User 3: alice.johnson@example.com / Password@123');
  console.log('------------------------\n');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
