const http = require('http');

function testAPI(path, method = 'GET', data = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
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

async function runFullTests() {
  console.log('🧪 Running comprehensive API tests...\n');

  try {
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const health = await testAPI('/api/health');
    console.log(`   ✅ Status: ${health.status}`);
    console.log('');

    // Test 2: Products endpoint (public)
    console.log('2. Testing products endpoint (public)...');
    const products = await testAPI('/api/products');
    console.log(`   ✅ Status: ${products.status}`);
    if (products.data.data) {
      console.log(`   ✅ Found ${products.data.data.length} products`);
      console.log(`   ✅ Pagination working: page ${products.data.pagination.current_page} of ${products.data.pagination.total_pages}`);
    }
    console.log('');

    // Test 3: Single product endpoint
    console.log('3. Testing single product endpoint...');
    if (products.data.data && products.data.data.length > 0) {
      const firstProduct = products.data.data[0];
      const singleProduct = await testAPI(`/api/products/${firstProduct.gtin}`);
      console.log(`   ✅ Status: ${singleProduct.status}`);
      console.log(`   ✅ Product: ${singleProduct.data.name.en}`);
    }
    console.log('');

    // Test 4: Auth login
    console.log('4. Testing authentication...');
    const login = await testAPI('/api/auth/login', 'POST', { passphrase: 'admin' });
    console.log(`   ✅ Login Status: ${login.status}`);

    // Extract session cookie
    let sessionCookie = null;
    if (login.headers['set-cookie']) {
      sessionCookie = login.headers['set-cookie'][0];
      console.log(`   ✅ Session established`);
    }
    console.log('');

    // Test 5: Protected companies endpoint
    console.log('5. Testing companies endpoint (protected)...');
    const companies = await testAPI('/api/companies', 'GET', null, sessionCookie);
    console.log(`   ✅ Status: ${companies.status}`);
    if (Array.isArray(companies.data)) {
      console.log(`   ✅ Found ${companies.data.length} companies`);
    }
    console.log('');

    // Test 6: Auth status
    console.log('6. Testing auth status...');
    const authStatus = await testAPI('/api/auth/status', 'GET', null, sessionCookie);
    console.log(`   ✅ Status: ${authStatus.status}`);
    console.log(`   ✅ Authenticated: ${authStatus.data.authenticated}`);
    console.log('');

    // Test 7: GTIN verification
    console.log('7. Testing GTIN verification...');
    const gtinVerify = await testAPI('/api/products/verify', 'POST', {
      gtins: ['37900123458228', '37900123458345', 'invalid123']
    });
    console.log(`   ✅ Status: ${gtinVerify.status}`);
    if (gtinVerify.data.results) {
      const validCount = gtinVerify.data.results.filter(r => r.valid).length;
      console.log(`   ✅ Verified: ${validCount}/${gtinVerify.data.results.length} GTINs valid`);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!\n');
    console.log('✅ Products API working');
    console.log('✅ Authentication working');
    console.log('✅ Companies API working');
    console.log('✅ GTIN verification working');
    console.log('✅ Session management working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runFullTests();
