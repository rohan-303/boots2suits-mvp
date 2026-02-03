
async function testGetJobs() {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/jobs');
    const data = await response.json();
    console.log('Jobs found:', data.length);
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}

testGetJobs();
