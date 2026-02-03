const BASE_URL = 'http://localhost:5000/api/auth';

const testUser = {
  firstName: 'Live',
  lastName: 'Tester',
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  role: 'veteran',
  militaryBranch: 'Army'
};

async function runTest() {
  console.log('🚀 Starting Live API Test...');
  console.log(`Target: ${BASE_URL}`);
  console.log(`User: ${testUser.email}`);

  try {
    // 1. Register
    console.log('\n1. Testing Registration...');
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    // Check if response is ok before parsing json, or handle parsing error
    const regData = await regRes.json();
    
    if (regRes.status === 201) {
      console.log('✅ Registration Successful!');
      console.log('Response:', regData);
    } else {
      console.error('❌ Registration Failed:', regData);
      process.exit(1);
    }

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginData = await loginRes.json();

    if (loginRes.status === 200) {
      console.log('✅ Login Successful!');
      console.log('Token received:', !!loginData.token);
      console.log('User role:', loginData.role);
    } else {
      console.error('❌ Login Failed:', loginData);
      process.exit(1);
    }

    console.log('\n✨ All Tests Passed Successfully!');

  } catch (error) {
    console.error('❌ Network or Server Error:', error);
    console.log('Make sure the backend server is running on port 5000');
  }
}

runTest();
