import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, Button, Input, LoadingSpinner, Alert } from '../components/ui';

const CompanyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyTelephone: '',
    companyAddress: ''
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchCompany();
    }
  }, [id, isEdit]);

  const fetchCompany = async () => {
    try {
      const company = await api.getCompany(id);
      setFormData({
        companyName: company.companyName,
        companyEmail: company.companyEmail,
        companyTelephone: company.companyTelephone,
        companyAddress: company.companyAddress
      });
    } catch (error) {
      setError('Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }

    if (!formData.companyTelephone.trim()) {
      newErrors.companyTelephone = 'Phone number is required';
    }

    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = 'Address is required';
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
      if (isEdit) {
        await api.updateCompany(id, formData);
        navigate(`/admin/companies/${id}`);
      } else {
        const newCompany = await api.createCompany(formData);
        navigate(`/admin/companies/${newCompany.id}`);
      }
    } catch (error) {
      setError(error.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Link to={isEdit ? `/admin/companies/${id}` : '/admin/companies'}>
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Company' : 'Add New Company'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update company information' : 'Enter company details to add a new company'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={errors.companyName}
                  placeholder="Enter company name"
                  className="w-full"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  error={errors.companyEmail}
                  placeholder="company@example.com"
                  className="w-full"
                />
                {errors.companyEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyTelephone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  id="companyTelephone"
                  name="companyTelephone"
                  type="tel"
                  value={formData.companyTelephone}
                  onChange={handleInputChange}
                  error={errors.companyTelephone}
                  placeholder="+33 1 23 45 67 89"
                  className="w-full"
                />
                {errors.companyTelephone && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyTelephone}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  type="text"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  error={errors.companyAddress}
                  placeholder="Enter company address"
                  className="w-full"
                />
                {errors.companyAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyAddress}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link to={isEdit ? `/admin/companies/${id}` : '/admin/companies'}>
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
                    {isEdit ? 'Update Company' : 'Create Company'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyFormPage;
