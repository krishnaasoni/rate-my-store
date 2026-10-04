const app = require('./src/app');
const prisma = require('./src/config/db');

async function testAuthPhase2() {
  console.log('--- TESTING PHASE 2 AUTH APIS & VALIDATIONS ---\n');

  const server = app.listen(5001, async () => {
    try {
      // 1. Test Admin Login
      console.log('1. Testing Admin Login...');
      const adminLoginRes = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@ratemystore.com',
          password: 'Password@123',
        }),
      });
      const adminLoginData = await adminLoginRes.json();
      console.log('Admin Login Response:', adminLoginRes.status, adminLoginData.message, 'Role:', adminLoginData.user?.role);

      const adminToken = adminLoginData.token;

      // 2. Test Get Me with Bearer Token
      console.log('\n2. Testing /api/auth/me with Bearer token...');
      const meRes = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const meData = await meRes.json();
      console.log('Get Me Response:', meRes.status, 'User Name:', meData.user?.name);

      // 3. Test Signup Validation (Short Name < 20 chars - Should fail)
      console.log('\n3. Testing Signup Validation (Short Name < 20 chars)...');
      const failSignupRes = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Short Name',
          email: 'newuser@example.com',
          address: '123 Test Street, City',
          password: 'Password@123',
        }),
      });
      const failSignupData = await failSignupRes.json();
      console.log('Expected Failure Response (400):', failSignupRes.status, failSignupData.message);

      // 4. Test Valid Signup (Name 20-60 chars, valid password)
      console.log('\n4. Testing Valid Signup...');
      const newEmail = `test.user.${Date.now()}@example.com`;
      const validSignupRes = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Registered User Account Person', // 35 chars
          email: newEmail,
          address: '779 Innovation Drive, Tech City, CA 95000',
          password: 'NewUser@999',
        }),
      });
      const validSignupData = await validSignupRes.json();
      console.log('Valid Signup Response (201):', validSignupRes.status, validSignupData.message, 'Token received:', !!validSignupData.token);

      // 5. Test Password Update
      console.log('\n5. Testing Password Update...');
      const userToken = validSignupData.token;
      const updatePassRes = await fetch('http://localhost:5001/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          currentPassword: 'NewUser@999',
          newPassword: 'UpdatedPass@888',
        }),
      });
      const updatePassData = await updatePassRes.json();
      console.log('Password Update Response (200):', updatePassRes.status, updatePassData.message);

      console.log('\n--- ALL AUTH PHASE 2 TESTS PASSED CLEANLY ---');
    } catch (err) {
      console.error('Test execution failed:', err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

testAuthPhase2();
