
// fetch is globally available in Node 18+

// Base URL
const API_URL = 'http://127.0.0.1:5000/api';

async function testJobFlow() {
  try {
    console.log('--- Starting Job Flow Test ---');

    // 1. Register/Login as Employer
    const employerData = {
      firstName: 'Test',
      lastName: 'Employer',
      email: `employer_${Date.now()}@test.com`,
      password: 'password123',
      role: 'employer',
      companyName: 'Test Corp'
    };

    console.log('1. Registering Employer...');
    let authRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employerData)
    });

    let authData = await authRes.json();

    if (!authRes.ok) {
        console.log('Registration failed, trying login...');
        // Try login if user exists (though email is unique with timestamp, so unlikely)
    }

    console.log('Employer Registered/Logged in:', authData.email);
    const token = authData.token;

    if (!token) {
      throw new Error('No token received');
    }

    // 2. Create Job
    const jobData = {
      title: 'Software Engineer',
      company: 'Test Corp',
      location: 'Remote',
      type: 'Full-time',
      salaryRange: {
        min: 100000,
        max: 150000,
        currency: 'USD'
      },
      description: 'We are looking for a great engineer.',
      requirements: ['React', 'Node.js', 'TypeScript']
    };

    console.log('2. Creating Job...');
    const jobRes = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    const jobResult = await jobRes.json();
    
    if (jobRes.ok) {
      console.log('✅ Job Created Successfully:', jobResult._id);
      console.log(jobResult);
    } else {
      console.error('❌ Job Creation Failed:', jobRes.status, jobResult);
    }

  } catch (error) {
    console.error('❌ Test Failed:', error);
  }
}

// Run if native fetch is available (Node 18+), otherwise need node-fetch
if (typeof fetch === 'undefined') {
    console.log('This script requires Node.js 18+ or node-fetch.');
} else {
    testJobFlow();
}
