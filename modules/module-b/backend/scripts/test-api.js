const http = require('http');

function testAPI(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await testAPI('/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log('');

    // Test products endpoint
    console.log('2. Testing products endpoint...');
    const products = await testAPI('/api/products');
    console.log(`   Status: ${products.status}`);
    if (products.data.data) {
      console.log(`   Found ${products.data.data.length} products`);
      console.log(`   Pagination:`, products.data.pagination);
    } else {
      console.log(`   Response:`, products.data);
    }
    console.log('');

    // Test companies endpoint (should require auth)
    console.log('3. Testing companies endpoint (should fail without auth)...');
    const companies = await testAPI('/api/companies');
    console.log(`   Status: ${companies.status}`);
    console.log(`   Response:`, companies.data);
    console.log('');

    console.log('✅ API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTests();
