import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE } from '../services/api';
import { Card, CardContent, Button, LoadingSpinner, Alert, Badge } from '../components/ui';

const ProductsListPage = () => {
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, companiesData] = await Promise.all([
        api.getProducts(),
        api.getCompanies()
      ]);
      setProducts(productsData);
      setCompanies(companiesData);
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.companyName : 'Unknown Company';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.gtin.includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = filterCompany === '' || product.companyId.toString() === filterCompany;
    
    return matchesSearch && matchesCompany;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage registered products</p>
        </div>
        <Link to="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products, GTIN, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                {product.imagePath ? (
                  <img
                    src={`${API_BASE.replace('/api', '')}${product.imagePath}`}
                    alt={product.name.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.name.en}
                  </h3>
                  <Badge variant="primary">{product.id}</Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">GTIN:</span> {product.gtin}
                  </div>
                  <div>
                    <span className="font-medium">Brand:</span> {product.brand}
                  </div>
                  <div>
                    <span className="font-medium">Company:</span> {getCompanyName(product.companyId)}
                  </div>
                  <div>
                    <span className="font-medium">Origin:</span> {product.countryOfOrigin}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link 
                    to={`/admin/products/${product.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link 
                    to={`/admin/products/${product.id}/edit`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCompany ? 'No products match your search criteria.' : 'Get started by adding your first product.'}
            </p>
            {!searchTerm && !filterCompany && (
              <Link to="/admin/products/new">
                <Button>Add Product</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsListPage;
