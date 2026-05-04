const http = require('http');

const data = JSON.stringify({
  personal: { fullName: "Test User" },
  experience: [],
  education: [],
  skills: [],
  projects: []
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/ai-review',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
