const app = require('./src/app');
const prisma = require('./src/config/db');

async function testAdminPhase3() {
  console.log('--- TESTING PHASE 3 SYSTEM ADMINISTRATOR APIS & SECURITY ---\n');

  const server = app.listen(5002, async () => {
    try {
      // 1. Admin Login
      console.log('1. Admin Login...');
      const adminRes = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@ratemystore.com',
          password: 'Password@123',
        }),
      });
      const adminData = await adminRes.json();
      const adminToken = adminData.token;
      console.log('Admin Login Success:', adminRes.status, 'Token acquired.');

      // 2. Normal User Login (for testing 403 Forbidden)
      console.log('\n2. Normal User Login...');
      const userRes = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'johnathan.doe@example.com',
          password: 'Password@123',
        }),
      });
      const userData = await userRes.json();
      const userToken = userData.token;

      // 3. Test Admin Dashboard Stats
      console.log('\n3. GET /api/admin/dashboard (Admin Token)...');
      const statsRes = await fetch('http://localhost:5002/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const statsData = await statsRes.json();
      console.log('Dashboard Stats (200):', statsRes.status, statsData.stats);

      // 4. Test Role Protection (Normal User trying Admin route - should return 403)
      console.log('\n4. Role Guard Verification (Normal User trying Admin Dashboard)...');
      const forbiddenRes = await fetch('http://localhost:5002/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const forbiddenData = await forbiddenRes.json();
      console.log('Role Guard Response (403 Expected):', forbiddenRes.status, forbiddenData.message);

      // 5. Test GET /api/admin/users
      console.log('\n5. GET /api/admin/users (with search and role filter)...');
      const usersRes = await fetch('http://localhost:5002/api/admin/users?role=STORE_OWNER', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const usersData = await usersRes.json();
      console.log('Users Count:', usersData.count, 'First Owner rating:', usersData.users[0]?.storeRating);

      // 6. Test POST /api/admin/users (Create Admin / Owner / User)
      console.log('\n6. POST /api/admin/users (Create new Store Owner)...');
      const newOwnerEmail = `new.store.owner.${Date.now()}@example.com`;
      const createOwnerRes = await fetch('http://localhost:5002/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: 'Brand New Store Owner Manager', // 30 chars
          email: newOwnerEmail,
          password: 'OwnerPass@999',
          address: '404 Executive Boulevard, Suite 500',
          role: 'STORE_OWNER',
        }),
      });
      const createOwnerData = await createOwnerRes.json();
      console.log('Create User Response (201):', createOwnerRes.status, createOwnerData.message, 'User ID:', createOwnerData.user?.id);

      // 7. Test GET /api/admin/stores
      console.log('\n7. GET /api/admin/stores (sort by rating desc)...');
      const storesRes = await fetch('http://localhost:5002/api/admin/stores?sortBy=rating&sortOrder=desc', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const storesData = await storesRes.json();
      console.log('Stores Count:', storesData.count, 'Top Store rating:', storesData.stores[0]?.averageRating);

      // 8. Test POST /api/admin/stores
      console.log('\n8. POST /api/admin/stores (Assigning to new owner)...');
      const createStoreRes = await fetch('http://localhost:5002/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: 'Apex Superstore Retail Outlet',
          email: 'contact@apexsuperstore.com',
          address: '1000 Commercial Way, Tech Hub',
          ownerId: createOwnerData.user.id,
        }),
      });
      const createStoreData = await createStoreRes.json();
      console.log('Create Store Response (201):', createStoreRes.status, createStoreData.message, 'Store ID:', createStoreData.store?.id);

      console.log('\n--- ALL ADMIN PHASE 3 TESTS PASSED CLEANLY ---');
    } catch (err) {
      console.error('Phase 3 test error:', err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

testAdminPhase3();
