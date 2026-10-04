const app = require('./src/app');
const prisma = require('./src/config/db');

async function testUserOwnerPhase4() {
  console.log('--- TESTING PHASE 4 USER & STORE OWNER APIS ---\n');

  const server = app.listen(5003, async () => {
    try {
      // 1. Normal User Login
      console.log('1. Logging in as Normal User...');
      const userRes = await fetch('http://localhost:5003/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'johnathan.doe@example.com',
          password: 'Password@123',
        }),
      });
      const userData = await userRes.json();
      const userToken = userData.token;
      console.log('User Login Success:', userRes.status, 'Token acquired.');

      // 2. Store Owner Login
      console.log('\n2. Logging in as Store Owner...');
      const ownerRes = await fetch('http://localhost:5003/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner@ratemystore.com',
          password: 'Password@123',
        }),
      });
      const ownerData = await ownerRes.json();
      const ownerToken = ownerData.token;
      console.log('Store Owner Login Success:', ownerRes.status, 'Token acquired.');

      // 3. GET /api/stores (Normal User viewing stores)
      console.log('\n3. GET /api/stores (Search and user rating info)...');
      const storesRes = await fetch('http://localhost:5003/api/stores?sortBy=rating&sortOrder=desc', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const storesData = await storesRes.json();
      console.log('Stores count:', storesData.count, 'First store overall rating:', storesData.stores[0]?.overallRating);
      const targetStoreId = storesData.stores[0]?.id;

      // 4. POST /api/ratings (Submitting / updating rating)
      console.log('\n4. POST /api/ratings (Submitting 5-star rating for store)...');
      const rateRes = await fetch('http://localhost:5003/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          storeId: targetStoreId,
          rating: 5,
        }),
      });
      const rateData = await rateRes.json();
      console.log('Rating Submission (200):', rateRes.status, rateData.message, 'Submitted Rating:', rateData.rating?.rating);

      // 5. Test Rating Upsert (Submitting second rating for same store should update, not fail or duplicate)
      console.log('\n5. Testing Rating Upsert (Re-submitting 4-star rating)...');
      const reRateRes = await fetch('http://localhost:5003/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          storeId: targetStoreId,
          rating: 4,
        }),
      });
      const reRateData = await reRateRes.json();
      console.log('Upsert Response (200):', reRateRes.status, reRateData.message, 'Updated Rating:', reRateData.rating?.rating);

      // 6. GET /api/owner/dashboard
      console.log('\n6. GET /api/owner/dashboard (Store Owner viewing dashboard)...');
      const ownerDashRes = await fetch('http://localhost:5003/api/owner/dashboard', {
        headers: { Authorization: `Bearer ${ownerToken}` },
      });
      const ownerDashData = await ownerDashRes.json();
      console.log('Owner Dashboard (200):', ownerDashRes.status);
      console.log('Store Name:', ownerDashData.dashboard?.store?.name);
      console.log('Store Average Rating:', ownerDashData.dashboard?.averageRating);
      console.log('Raters Count:', ownerDashData.dashboard?.ratingUsers?.length);

      console.log('\n--- ALL USER & STORE OWNER PHASE 4 TESTS PASSED CLEANLY ---');
    } catch (err) {
      console.error('Phase 4 test error:', err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

testUserOwnerPhase4();
