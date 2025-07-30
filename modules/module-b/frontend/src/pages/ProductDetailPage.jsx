import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { API_BASE } from '../services/api';
import { Card, CardContent, Button, LoadingSpinner, Alert, Badge } from '../components/ui';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const productData = await api.getProduct(id);
      setProduct(productData);
      
      // Fetch company details
      const companyData = await api.getCompany(productData.companyId);
      setCompany(companyData);
    } catch (error) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await api.deleteProduct(id);
        navigate('/admin/products');
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Alert variant="danger" title="Error">
          {error || 'Product not found'}
        </Alert>
        <Link to="/admin/products">
          <Button variant="outline">← Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link to="/admin/products">
              <Button variant="outline" size="sm">
                ← Back
              </Button>
            </Link>
            <Badge variant="secondary">ID: {product.id}</Badge>
            <Badge variant="primary">GTIN: {product.gtin}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name[language]}</h1>
          <p className="text-gray-600">{product.brand}</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={language === 'en' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('en')}
              className="px-3 py-1"
            >
              EN
            </Button>
            <Button
              variant={language === 'fr' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('fr')}
              className="px-3 py-1"
            >
              FR
            </Button>
          </div>
          <Link to={`/admin/products/${id}/edit`}>
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
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
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <Link 
                to={`/product/${product.gtin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Public Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Information</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Product Name ({language.toUpperCase()})</label>
                  <p className="text-lg font-medium text-gray-900">{product.name[language]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">GTIN</label>
                  <p className="font-mono text-lg">{product.gtin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Brand</label>
                  <p className="text-gray-900">{product.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Country of Origin</label>
                  <p className="text-gray-900">{product.countryOfOrigin}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weight Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Weight Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Gross Weight</label>
                  <p className="text-gray-900">{product.weight.gross} {product.weight.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Net Weight</label>
                  <p className="text-gray-900">{product.weight.net} {product.weight.unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          {company && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Company Information</h2>
                  <Link to={`/admin/companies/${company.id}`}>
                    <Button variant="outline" size="sm">
                      View Company
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{company.companyName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-900">{company.companyEmail}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Phone:</span>
                    <span className="ml-2 text-gray-900">{company.companyTelephone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Address:</span>
                    <span className="ml-2 text-gray-900">{company.companyAddress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product Description */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Description ({language.toUpperCase()})</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description[language]}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
