# Module B Backend - Refactored

This is a refactored version of the Module B backend that follows better code organization practices by separating concerns into different modules.

## 🏗️ Project Structure

```
backend/
├── server.js              # Original monolithic server (kept for backward compatibility)
├── server-refactored.js   # New refactored server entry point
├── src/
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   └── upload.js       # File upload middleware
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── companies.js    # Companies CRUD routes
│   │   └── products.js     # Products CRUD routes
│   ├── services/
│   │   └── csvSeeder.js    # CSV data seeding service
│   └── utils/
│       ├── helpers.js      # Helper functions
│       └── validation.js   # Validation utilities
├── scripts/
│   └── seed.js            # Database seeding script
├── constants/
│   ├── companies.csv      # Companies seed data
│   └── products.csv       # Products seed data
└── uploads/               # File upload directory
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wsc2024_products_management
DB_PORT=3306
```

### 3. Database Setup

Make sure your MySQL database is running and create the database:

```sql
CREATE DATABASE wsc2024_products_management;
```

Run your database migration scripts to create the required tables.

### 4. Seed Initial Data

Seed the database with initial data from CSV files:

```bash
# Seed all data (companies + products)
npm run seed

# Or seed individually
npm run seed:companies  # Seed companies only
npm run seed:products   # Seed products only
```

### 5. Start the Server

```bash
# Start the refactored server
npm run start:refactored

# Or for development with auto-reload
npm run dev:refactored

# Or start the original server (backward compatibility)
npm start
npm run dev
```

## 📚 Available Scripts

- `npm start` - Start original server
- `npm run start:refactored` - Start refactored server
- `npm run dev` - Start original server with nodemon
- `npm run dev:refactored` - Start refactored server with nodemon
- `npm run seed` - Seed all data from CSV files
- `npm run seed:companies` - Seed companies only
- `npm run seed:products` - Seed products only

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - Login with passphrase
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Check authentication status

### Companies

- `GET /api/companies` - Get all companies
- `GET /api/companies/active` - Get active companies
- `GET /api/companies/deactivated` - Get deactivated companies
- `GET /api/companies/:id` - Get single company
- `GET /api/companies/:id/products` - Get company products
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company

### Products

- `GET /api/products` - Get products with pagination
- `GET /api/products/admin` - Get all products (admin)
- `GET /api/products/:gtin` - Get single product
- `GET /api/products/admin/:gtin` - Get single product (admin)
- `POST /api/products` - Create product
- `PUT /api/products/:gtin` - Update product
- `DELETE /api/products/:gtin` - Delete product
- `DELETE /api/products/:gtin/image` - Remove product image
- `POST /api/products/verify` - Bulk GTIN verification

### Utilities

- `GET /api/health` - Health check

## 🗂️ Key Improvements

### 1. **Separation of Concerns**

- Database configuration separated into `config/database.js`
- Routes organized by feature (`auth.js`, `companies.js`, `products.js`)
- Middleware extracted into separate files
- Utilities and helpers modularized

### 2. **Better Code Organization**

- Clear folder structure following Node.js best practices
- Each module has a single responsibility
- Easy to test and maintain individual components

### 3. **Enhanced Error Handling**

- Centralized error handling middleware
- Consistent error response format
- Better logging for debugging

### 4. **Configuration Management**

- Environment variables for all configuration
- Example environment file provided
- Secure defaults and validation

### 5. **Data Seeding**

- Automated CSV data import
- Flexible seeding options (all, companies only, products only)
- Duplicate detection and handling
- Progress logging and error reporting

## 🔒 Security Features

- Session-based authentication
- File upload validation and size limits
- Input validation for all endpoints
- SQL injection protection through parameterized queries
- CORS configuration
- Environment-based configuration

## 🧪 Testing

The modular structure makes it easy to unit test individual components:

```javascript
// Example: Testing validation utilities
const { validateGTIN, validateEmail } = require("./src/utils/validation");

console.log(validateGTIN("1234567890123")); // true
console.log(validateEmail("test@example.com")); // true
```

## 📦 Dependencies

### Production

- `express` - Web framework
- `mysql2` - MySQL database driver
- `cors` - Cross-origin resource sharing
- `express-session` - Session management
- `multer` - File upload handling
- `dotenv` - Environment variable loading

### Development

- `nodemon` - Development server with auto-reload

## 🔄 Migration from Original Server

The refactored server maintains full backward compatibility with the original API. You can:

1. Test the refactored version alongside the original
2. Gradually migrate your frontend to use the new structure
3. Switch to the refactored version when ready

Both servers can run simultaneously on different ports for comparison and testing.
