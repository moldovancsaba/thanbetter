import fetch from 'node-fetch';

async function testProduction() {
  const BASE_URL = 'https://thanperfect-foqt16qgi-narimato.vercel.app';
  
  try {
    // 1. Test login
    console.log('Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser_' + Date.now()
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);

    // Store the session token
    const sessionToken = loginData.sessionToken;

    // 2. Test getting users
    console.log('\nTesting get users...');
    const usersResponse = await fetch(`${BASE_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    });

    if (!usersResponse.ok) {
      throw new Error(`Get users failed: ${usersResponse.status} ${usersResponse.statusText}`);
    }

    const users = await usersResponse.json();
    console.log('Users retrieved successfully:', users);

    // 3. Test creating a new user
    console.log('\nTesting create user...');
    const newUsername = 'testuser_' + Date.now();
    const createResponse = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: newUsername
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create user failed: ${createResponse.status} ${createResponse.statusText}`);
    }

    const newUser = await createResponse.json();
    console.log('User created successfully:', newUser);

    // Test successful
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testProduction();

