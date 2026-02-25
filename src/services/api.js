const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Backend is not running or returning HTML
        console.warn(`Backend not available at ${url}. Response was not JSON.`);
        throw new Error('Backend server is not running or endpoint not found');
      }
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `API error: ${response.statusText}`;
        let errorData = null;
        try {
          errorData = await response.json();
          // NestJS returns errors in different formats
          if (errorData.message) {
            // Check if message is an array (NestJS validation errors)
            if (Array.isArray(errorData.message)) {
              errorMessage = errorData.message.join(', ');
            } else {
              errorMessage = errorData.message;
            }
          } else if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
          } else if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            if (text) {
              errorMessage = text;
            }
          } catch (textError) {
            // Use default error message
          }
        }
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      // Don't log errors for expected failures (backend not running)
      if (error.message.includes('Backend server')) {
        throw error;
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products endpoints
  async getProducts() {
    return this.request('/api/products');
  }

  async getProduct(id) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getOrders() {
    return this.request('/api/orders');
  }

  async getOrder(id, userId) {
    const url = userId ? `/api/orders/${id}?userId=${userId}` : `/api/orders/${id}`;
    return this.request(url);
  }

  async getUserOrders(userId) {
    return this.request(`/api/orders/user/${userId}`);
  }

  // Requests endpoints
  async createContactRequest(requestData) {
    return this.request('/api/requests/contact', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createGraphicsRequest(requestData) {
    return this.request('/api/requests/graphics', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getContactRequests() {
    return this.request('/api/requests/contact');
  }

  async getGraphicsRequests() {
    return this.request('/api/requests/graphics');
  }

  async updateRequestStatus(type, id, status) {
    return this.request(`/api/requests/${type}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // User endpoints
  async login(email, password) {
    return this.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async register(email, password, firstName, lastName) {
    return this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getUser(id) {
    return this.request(`/api/users/${id}`);
  }

  async updateProfile(id, profileData) {
    return this.request(`/api/users/${id}/profile`, {
      method: 'POST',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Addresses endpoints
  async addAddress(userId, addressData) {
    return this.request(`/api/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async updateAddress(userId, addressId, addressData) {
    return this.request(`/api/users/${userId}/addresses/${addressId}`, {
      method: 'POST',
      body: JSON.stringify(addressData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deleteAddress(userId, addressId) {
    return this.request(`/api/users/${userId}/addresses/${addressId}/delete`, {
      method: 'POST',
    });
  }

  // Payment methods endpoints
  async addPaymentMethod(userId, paymentData) {
    return this.request(`/api/users/${userId}/payment-methods`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async updatePaymentMethod(userId, methodId, paymentData) {
    return this.request(`/api/users/${userId}/payment-methods/${methodId}`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deletePaymentMethod(userId, methodId) {
    return this.request(`/api/users/${userId}/payment-methods/${methodId}/delete`, {
      method: 'POST',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/api/admin/stats');
  }

  async getAdminOrders() {
    return this.request('/api/admin/orders');
  }

  async getAllAdminOrders() {
    return this.request('/api/admin/orders/all');
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAdminCustomers() {
    return this.request('/api/admin/customers');
  }
}

// Export named instance to avoid anonymous default export warning
const apiService = new ApiService();
export default apiService;

