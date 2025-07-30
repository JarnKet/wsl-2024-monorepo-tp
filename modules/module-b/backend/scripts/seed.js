#!/usr/bin/env node

require('dotenv').config();

const { seedAll, seedCompanies, seedProducts } = require('../src/services/csvSeeder');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'companies':
        console.log('🏢 Seeding companies only...');
        await seedCompanies();
        break;

      case 'products':
        console.log('📦 Seeding products only...');
        await seedProducts();
        break;

      case 'all':
      case undefined:
        console.log('🌍 Seeding all data...');
        await seedAll();
        break;

      default:
        console.log('❌ Unknown command. Available commands:');
        console.log('  npm run seed           - Seed all data');
        console.log('  npm run seed companies - Seed companies only');
        console.log('  npm run seed products  - Seed products only');
        process.exit(1);
    }

    console.log('✨ Seeding script completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('💥 Seeding script failed:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Seeding interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Seeding terminated');
  process.exit(1);
});

// Run the script
main();
