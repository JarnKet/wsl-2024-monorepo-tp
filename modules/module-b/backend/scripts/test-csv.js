#!/usr/bin/env node

// Test CSV parsing without database connection
const fs = require('fs').promises;
const path = require('path');

/**
 * Parse CSV content into array of objects
 * @param {string} csvContent - Raw CSV content
 * @returns {Array} - Array of objects representing rows
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

async function testCSVParsing() {
  try {
    console.log('🧪 Testing CSV parsing...');

    // Test companies CSV
    const companiesCsvPath = path.join(__dirname, '../constants/companies.csv');
    const companiesCsvContent = await fs.readFile(companiesCsvPath, 'utf-8');
    const companies = parseCSV(companiesCsvContent);

    console.log(`📊 Companies CSV: Found ${companies.length} companies`);
    console.log('📋 First company:', companies[0]);

    // Test products CSV
    const productsCsvPath = path.join(__dirname, '../constants/products.csv');
    const productsCsvContent = await fs.readFile(productsCsvPath, 'utf-8');
    const products = parseCSV(productsCsvContent);

    console.log(`📊 Products CSV: Found ${products.length} products`);
    console.log('📋 First product:', products[0]);

    console.log('✅ CSV parsing test completed successfully!');

  } catch (error) {
    console.error('❌ CSV parsing test failed:', error);
  }
}

// Run the test
testCSVParsing();
