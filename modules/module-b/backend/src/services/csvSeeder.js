const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/database');

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

/**
 * Seed companies from CSV file
 * @returns {Promise} - Promise that resolves when seeding is complete
 */
async function seedCompanies() {
  try {
    console.log('🌱 Starting companies seeding...');

    const csvPath = path.join(__dirname, '../../constants/companies.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const companies = parseCSV(csvContent);

    console.log(`📄 Found ${companies.length} companies in CSV`);

    // Clear existing companies (optional - be careful with this!)
    // await pool.execute('DELETE FROM companies');
    // console.log('🗑️  Cleared existing companies');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const company of companies) {
      try {
        // Check if company already exists
        const [existing] = await pool.execute(
          'SELECT id FROM companies WHERE company_name = ? AND email = ?',
          [company['Company Name'], company['Company Email Address']]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Skipping existing company: ${company['Company Name']}`);
          skippedCount++;
          continue;
        }

        // Insert new company
        await pool.execute(
          `INSERT INTO companies (
            company_name, address, telephone, email,
            owner_name, owner_mobile, owner_email,
            contact_name, contact_mobile, contact_email,
            is_deactivated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            company['Company Name'],
            company['Company Address'],
            company['Company Telephone Number'],
            company['Company Email Address'],
            company['Owner Name'],
            company['Owner Mobile Number'],
            company['Owner Email Address'],
            company['Contact Name'],
            company['Contact Mobile Number'],
            company['Contact Email Address'],
            false // Default to not deactivated (active)
          ]
        );

        console.log(`✅ Inserted company: ${company['Company Name']}`);
        insertedCount++;

      } catch (error) {
        console.error(`❌ Error inserting company ${company['Company Name']}:`, error.message);
      }
    }

    console.log(`🎉 Companies seeding completed! Inserted: ${insertedCount}, Skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Error seeding companies:', error);
    throw error;
  }
}

/**
 * Seed products from CSV file
 * @returns {Promise} - Promise that resolves when seeding is complete
 */
async function seedProducts() {
  try {
    console.log('🌱 Starting products seeding...');

    const csvPath = path.join(__dirname, '../../constants/products.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const products = parseCSV(csvContent);

    console.log(`📄 Found ${products.length} products in CSV`);

    // Get all companies for mapping
    const [companies] = await pool.execute('SELECT id, company_name FROM companies');
    const companyMap = {};
    companies.forEach(company => {
      companyMap[company.company_name] = company.id;
    });

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Check if product already exists
        const [existing] = await pool.execute(
          'SELECT gtin FROM products WHERE gtin = ?',
          [product['GTIN']]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Skipping existing product: ${product['GTIN']}`);
          skippedCount++;
          continue;
        }

        // Find a random company ID (since CSV doesn't specify which company owns which product)
        const companyIds = Object.values(companyMap);
        const randomCompanyId = companyIds[Math.floor(Math.random() * companyIds.length)];

        if (!randomCompanyId) {
          console.error(`❌ No companies found to assign product: ${product['GTIN']}`);
          errorCount++;
          continue;
        }

        // Insert new product
        await pool.execute(
          `INSERT INTO products (
            gtin, company_id, name_en, name_fr, description_en, description_fr,
            brand, country_of_origin, gross_weight, net_weight, weight_unit,
            is_hidden
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product['GTIN'],
            randomCompanyId,
            product['Name'],
            product['Name in French'],
            product['Description'],
            product['Description in French'],
            product['Brand Name'],
            product['Country of Origin'],
            parseFloat(product['Gross Weight (with packaging)']) || 0,
            parseFloat(product['Net Content Weight']) || 0,
            product['Weight Unit'] || 'g',
            false // Default to visible
          ]
        );

        console.log(`✅ Inserted product: ${product['Name']} (${product['GTIN']})`);
        insertedCount++;

      } catch (error) {
        console.error(`❌ Error inserting product ${product['GTIN']}:`, error.message);
        errorCount++;
      }
    }

    console.log(`🎉 Products seeding completed! Inserted: ${insertedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

/**
 * Seed all data from CSV files
 * @returns {Promise} - Promise that resolves when all seeding is complete
 */
async function seedAll() {
  try {
    console.log('🚀 Starting database seeding...');

    // Seed companies first (products depend on companies)
    await seedCompanies();

    // Then seed products
    await seedProducts();

    console.log('🎊 All seeding completed successfully!');

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

module.exports = {
  seedCompanies,
  seedProducts,
  seedAll
};
