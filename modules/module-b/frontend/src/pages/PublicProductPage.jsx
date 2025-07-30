import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { API_BASE } from '../services/api';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '../components/ui';

const PublicProductPage = () => {
  const { gtin } = useParams();
  const [product, setProduct] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [gtin]);

  const fetchProduct = async () => {
    try {
      const data = await api.getPublicProduct(gtin);
      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="danger" title="Product Not Found">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" lang={language}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {product.name[language]}
                  </h1>
                  <p className="text-blue-100">
                    {product.company.companyName}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={language === 'en' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-white text-blue-600' : 'bg-transparent border-white text-white hover:bg-white hover:text-blue-600'}
                  >
                    English
                  </Button>
                  <Button
                    variant={language === 'fr' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('fr')}
                    className={language === 'fr' ? 'bg-white text-blue-600' : 'bg-transparent border-white text-white hover:bg-white hover:text-blue-600'}
                  >
                    Français
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {product.imagePath ? (
                      <img
                        src={`${API_BASE.replace('/api', '')}${product.imagePath}`}
                        alt={product.name[language]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">GTIN</h3>
                      <p className="font-mono text-lg font-semibold">{product.gtin}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Brand</h3>
                      <p className="text-lg font-semibold">{product.brand}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Country of Origin</h3>
                      <p className="text-lg font-semibold">{product.countryOfOrigin}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Weight</h3>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Gross:</span> {product.weight.gross} {product.weight.unit}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Net:</span> {product.weight.net} {product.weight.unit}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Company Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">Name:</span>
                        <span className="ml-2 text-blue-700">{product.company.companyName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Address:</span>
                        <span className="ml-2 text-blue-700">{product.company.companyAddress}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Phone:</span>
                        <span className="ml-2 text-blue-700">{product.company.companyTelephone}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Email:</span>
                        <span className="ml-2 text-blue-700">{product.company.companyEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'en' ? 'Product Description' : 'Description du Produit'}
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description[language]}
                  </p>
                </div>
              </div>

              {/* Made in France Badge */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Made in France</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicProductPage;
