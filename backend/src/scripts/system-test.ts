import axios from 'axios';
import process from 'process';

const API_URL = 'http://localhost:5000/api';
let veteranToken = '';
let employerToken = '';
let veteranId = '';
let employerId = '';
let jobId = '';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function runTest() {
  console.log('🚀 Starting Comprehensive System Test...\n');

  try {
    // 1. Register Veteran
    console.log('1️⃣  Registering Veteran...');
    try {
      const vetRes = await axios.post(`${API_URL}/auth/register`, {
        firstName: 'John',
        lastName: 'Doe',
        email: `john.doe.${Date.now()}@example.com`,
        password: 'password123',
        role: 'veteran',
        militaryBranch: 'Army'
      });
      veteranToken = vetRes.data.token;
      veteranId = vetRes.data._id;
      console.log('✅ Veteran Registered:', vetRes.data.email);
    } catch (e: any) {
      console.error('❌ Veteran Registration Failed:', e.response?.data || e.message);
      process.exit(1);
    }

    // 2. Register Employer
    console.log('\n2️⃣  Registering Employer...');
    try {
      const empRes = await axios.post(`${API_URL}/auth/register`, {
        firstName: 'Jane',
        lastName: 'Smith',
        email: `jane.smith.${Date.now()}@company.com`,
        password: 'password123',
        role: 'employer',
        companyName: 'TechCorp',
        companyDescription: 'Leading tech company'
      });
      employerToken = empRes.data.token;
      employerId = empRes.data._id;
      console.log('✅ Employer Registered:', empRes.data.email);
    } catch (e: any) {
      console.error('❌ Employer Registration Failed:', e.response?.data || e.message);
      process.exit(1);
    }

    // 3. Employer Posts a Job
    console.log('\n3️⃣  Employer Posting Job...');
    try {
      const jobRes = await axios.post(`${API_URL}/jobs`, {
        title: 'Software Engineer',
        company: 'TechCorp',
        location: 'Remote',
        description: 'Build amazing things',
        requirements: ['React', 'Node.js']
      }, { headers: { Authorization: `Bearer ${employerToken}` } });
      jobId = jobRes.data._id;
      console.log('✅ Job Posted:', jobRes.data.title);
    } catch (e: any) {
      console.error('❌ Job Posting Failed:', e.response?.data || e.message);
    }

    // 4. Veteran Builds Resume (Mock)
    console.log('\n4️⃣  Veteran Creating Resume...');
    try {
      await axios.post(`${API_URL}/resume`, {
        militaryHistory: {
          branch: 'Army',
          rank: 'Captain',
          mosCode: '25A',
          yearsOfService: 5,
          description: 'Led communications team.'
        },
        title: 'Software Dev Resume'
      }, { headers: { Authorization: `Bearer ${veteranToken}` } });
      console.log('✅ Resume Created');
    } catch (e: any) {
      console.error('❌ Resume Creation Failed:', e.response?.data || e.message);
    }

    // 5. Veteran Applies for Job
    console.log('\n5️⃣  Veteran Applying for Job...');
    try {
      await axios.post(`${API_URL}/applications/${jobId}`, {}, { 
        headers: { Authorization: `Bearer ${veteranToken}` } 
      });
      console.log('✅ Application Submitted');
    } catch (e: any) {
      console.error('❌ Application Failed:', e.response?.data || e.message);
    }

    // 6. Employer Views Applications
    console.log('\n6️⃣  Employer Viewing Applications...');
    try {
      const appsRes = await axios.get(`${API_URL}/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log(`✅ Found ${appsRes.data.length} application(s)`);
    } catch (e: any) {
      console.error('❌ Fetching Applications Failed:', e.response?.data || e.message);
    }

    // 7. Messaging Flow
    console.log('\n7️⃣  Testing Messaging...');
    try {
      // Employer sends message
      await axios.post(`${API_URL}/messages`, {
        recipientId: veteranId,
        content: 'Hi John, when can you interview?'
      }, { headers: { Authorization: `Bearer ${employerToken}` } });
      console.log('✅ Employer sent message');

      await sleep(1000);

      // Veteran reads message
      const vetMsgs = await axios.get(`${API_URL}/messages/${employerId}`, {
        headers: { Authorization: `Bearer ${veteranToken}` }
      });
      if (vetMsgs.data.length > 0) {
        console.log('✅ Veteran received message:', vetMsgs.data[0].content);
      } else {
        console.error('❌ Veteran did not receive message');
      }

      // Veteran replies
      await axios.post(`${API_URL}/messages`, {
        recipientId: employerId,
        content: 'I am free tomorrow!'
      }, { headers: { Authorization: `Bearer ${veteranToken}` } });
      console.log('✅ Veteran replied');

    } catch (e: any) {
      console.error('❌ Messaging Failed:', e.response?.data || e.message);
    }

    console.log('\n✨ Test Run Completed Successfully!');

  } catch (error: any) {
    console.error('\n❌ Unexpected Error:', error.message);
  }
}

runTest();