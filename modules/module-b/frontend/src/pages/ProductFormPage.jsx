import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, Button, Input, Textarea, Select, LoadingSpinner, Alert } from '../components/ui';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const preselectedCompanyId = location.state?.companyId;
  
  const [formData, setFormData] = useState({
    gtin: '',
    name: { en: '', fr: '' },
    brand: '',
    description: { en: '', fr: '' },
    countryOfOrigin: 'France',
    weight: { gross: '', net: '', unit: 'g' },
    companyId: preselectedCompanyId || '',
    image: null
  });
  
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCompanies();
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchCompanies = async () => {
    try {
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (error) {
      setError('Failed to fetch companies');
    }
  };

  const fetchProduct = async () => {
    try {
      const product = await api.getProduct(id);
      setFormData({
        gtin: product.gtin,
        name: product.name,
        brand: product.brand,
        description: product.description,
        countryOfOrigin: product.countryOfOrigin,
        weight: product.weight,
        companyId: product.companyId,
        image: null // Reset image for edit
      });
    } catch (error) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gtin.trim()) {
      newErrors.gtin = 'GTIN is required';
    } else if (!/^\d{8,14}$/.test(formData.gtin)) {
      newErrors.gtin = 'GTIN must be 8-14 digits';
    }

    if (!formData.name.en.trim()) {
      newErrors['name.en'] = 'English name is required';
    }

    if (!formData.name.fr.trim()) {
      newErrors['name.fr'] = 'French name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.description.en.trim()) {
      newErrors['description.en'] = 'English description is required';
    }

    if (!formData.description.fr.trim()) {
      newErrors['description.fr'] = 'French description is required';
    }

    if (!formData.countryOfOrigin.trim()) {
      newErrors.countryOfOrigin = 'Country of origin is required';
    }

    if (!formData.weight.gross || formData.weight.gross <= 0) {
      newErrors['weight.gross'] = 'Gross weight must be greater than 0';
    }

    if (!formData.weight.net || formData.weight.net <= 0) {
      newErrors['weight.net'] = 'Net weight must be greater than 0';
    }

    if (parseFloat(formData.weight.net) > parseFloat(formData.weight.gross)) {
      newErrors['weight.net'] = 'Net weight cannot exceed gross weight';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Company selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('gtin', formData.gtin);
      formDataToSend.append('name', JSON.stringify(formData.name));
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('description', JSON.stringify(formData.description));
      formDataToSend.append('countryOfOrigin', formData.countryOfOrigin);
      formDataToSend.append('weight', JSON.stringify(formData.weight));
      formDataToSend.append('companyId', formData.companyId);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let result;
      if (isEdit) {
        result = await api.updateProduct(id, formDataToSend);
      } else {
        result = await api.createProduct(formDataToSend);
      }
      
      navigate(`/admin/products/${result.id || id}`);
    } catch (error) {
      setError(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Link to={isEdit ? `/admin/products/${id}` : '/admin/products'}>
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update product information' : 'Enter product details to add a new product'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="gtin" className="block text-sm font-medium text-gray-700 mb-2">
                    GTIN *
                  </label>
                  <Input
                    id="gtin"
                    name="gtin"
                    type="text"
                    value={formData.gtin}
                    onChange={handleInputChange}
                    error={errors.gtin}
                    placeholder="Enter 8-14 digit GTIN"
                    maxLength={14}
                    className="w-full"
                  />
                  {errors.gtin && (
                    <p className="mt-1 text-sm text-red-600">{errors.gtin}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <Input
                    id="brand"
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleInputChange}
                    error={errors.brand}
                    placeholder="Enter brand name"
                    className="w-full"
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700 mb-2">
                    Country of Origin *
                  </label>
                  <Input
                    id="countryOfOrigin"
                    name="countryOfOrigin"
                    type="text"
                    value={formData.countryOfOrigin}
                    onChange={handleInputChange}
                    error={errors.countryOfOrigin}
                    placeholder="Enter country of origin"
                    className="w-full"
                  />
                  {errors.countryOfOrigin && (
                    <p className="mt-1 text-sm text-red-600">{errors.countryOfOrigin}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <Select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    error={errors.companyId}
                    className="w-full"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </Select>
                  {errors.companyId && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weight Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Weight Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="weight.gross" className="block text-sm font-medium text-gray-700 mb-2">
                    Gross Weight *
                  </label>
                  <Input
                    id="weight.gross"
                    name="weight.gross"
                    type="number"
                    step="0.01"
                    value={formData.weight.gross}
                    onChange={handleInputChange}
                    error={errors['weight.gross']}
                    placeholder="Enter gross weight"
                    className="w-full"
                  />
                  {errors['weight.gross'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['weight.gross']}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="weight.net" className="block text-sm font-medium text-gray-700 mb-2">
                    Net Weight *
                  </label>
                  <Input
                    id="weight.net"
                    name="weight.net"
                    type="number"
                    step="0.01"
                    value={formData.weight.net}
                    onChange={handleInputChange}
                    error={errors['weight.net']}
                    placeholder="Enter net weight"
                    className="w-full"
                  />
                  {errors['weight.net'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['weight.net']}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="weight.unit" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight Unit *
                  </label>
                  <Select
                    id="weight.unit"
                    name="weight.unit"
                    value={formData.weight.unit}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload an image for this product (optional)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Multilingual Fields */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Names</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name.en" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name (English) *
                </label>
                <Input
                  id="name.en"
                  name="name.en"
                  type="text"
                  value={formData.name.en}
                  onChange={handleInputChange}
                  error={errors['name.en']}
                  placeholder="Enter English product name"
                  className="w-full"
                />
                {errors['name.en'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['name.en']}</p>
                )}
              </div>
              <div>
                <label htmlFor="name.fr" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name (French) *
                </label>
                <Input
                  id="name.fr"
                  name="name.fr"
                  type="text"
                  value={formData.name.fr}
                  onChange={handleInputChange}
                  error={errors['name.fr']}
                  placeholder="Enter French product name"
                  className="w-full"
                />
                {errors['name.fr'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['name.fr']}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Descriptions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="description.en" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English) *
                </label>
                <Textarea
                  id="description.en"
                  name="description.en"
                  value={formData.description.en}
                  onChange={handleInputChange}
                  error={errors['description.en']}
                  placeholder="Enter English product description"
                  rows={4}
                  className="w-full"
                />
                {errors['description.en'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['description.en']}</p>
                )}
              </div>
              <div>
                <label htmlFor="description.fr" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (French) *
                </label>
                <Textarea
                  id="description.fr"
                  name="description.fr"
                  value={formData.description.fr}
                  onChange={handleInputChange}
                  error={errors['description.fr']}
                  placeholder="Enter French product description"
                  rows={4}
                  className="w-full"
                />
                {errors['description.fr'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['description.fr']}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-end space-x-3">
              <Link to={isEdit ? `/admin/products/${id}` : '/admin/products'}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {isEdit ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProductFormPage;
