// API Configuration
const API_BASE = 'http://localhost:3001/api';

// API Helper Functions
const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    } else if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
      config.body = options.body;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  // Auth
  login: (passphrase) => api.request('/auth/login', { method: 'POST', body: { passphrase } }),
  logout: () => api.request('/auth/logout', { method: 'POST' }),
  getAuthStatus: () => api.request('/auth/status'),

  // Companies
  getCompanies: () => api.request('/companies'),
  getActiveCompanies: () => api.request('/companies/active'),
  getDeactivatedCompanies: () => api.request('/companies/deactivated'),
  getCompany: (id) => api.request(`/companies/${id}`),
  getCompanyProducts: (id) => api.request(`/companies/${id}/products`),
  createCompany: (data) => api.request('/companies', { method: 'POST', body: data }),
  updateCompany: (id, data) => api.request(`/companies/${id}`, { method: 'PUT', body: data }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/products${query ? '?' + query : ''}`);
  },
  getAdminProducts: () => api.request('/admin/products'),
  getProduct: (gtin) => api.request(`/products/${gtin}`),
  getAdminProduct: (gtin) => api.request(`/admin/products/${gtin}`),
  getPublicProduct: (gtin) => api.request(`/public/products/${gtin}`),
  createProduct: (data) => api.request('/products', { method: 'POST', body: data }),
  updateProduct: (gtin, data) => api.request(`/products/${gtin}`, { method: 'PUT', body: data }),
  deleteProduct: (gtin) => api.request(`/products/${gtin}`, { method: 'DELETE' }),
  removeProductImage: (gtin) => api.request(`/products/${gtin}/image`, { method: 'DELETE' }),

  // GTIN Verification
  verifyGTINs: (gtins) => api.request('/products/verify', { method: 'POST', body: { gtins } }),
};

export { API_BASE };
export default api;
