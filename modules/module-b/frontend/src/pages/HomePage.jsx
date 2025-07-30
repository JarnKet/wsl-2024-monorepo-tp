import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button } from '../components/ui';

const HomePage = () => {
  return (
    <div className="max-w-6xl px-4 py-12 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Made-in-France Products Management System
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600">
          Manage companies and products with our comprehensive administration system.
          Verify GTIN codes and explore product information with multi-language support.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">GTIN Verification</h2>
            <p className="mb-6 text-gray-600">
              Verify multiple GTIN codes in bulk to check if they are registered and valid in our system.
            </p>
            <Link to="/verify">
              <Button variant="primary" className="w-full">
                Verify GTINs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Companies Management</h2>
            <p className="mb-6 text-gray-600">
              Manage company information, contacts, and view associated products with comprehensive admin tools.
            </p>
            <Link to="/login">
              <Button variant="success" className="w-full">
                Manage Companies
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Products Management</h2>
            <p className="mb-6 text-gray-600">
              Create, edit, and manage product information with multi-language support and image uploads.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Manage Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Features Overview
          </h3>
          <div className="grid gap-6 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Multi-language Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>GTIN Validation</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Image Upload</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Public Product Pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
