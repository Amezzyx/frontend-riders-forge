import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Slovakia'
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Slovakia',
    phone: '',
    isDefault: false
  });
  const [paymentFormData, setPaymentFormData] = useState({
    type: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    isDefault: false
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Load user profile data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const userData = await api.getUser(user.id);
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          country: userData.country || 'Slovakia'
        });
        setAddresses(userData.addresses || []);
        setPaymentMethods(userData.paymentMethods || []);
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Load user orders
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id || activeTab !== 'orders') return;
      
      setOrdersLoading(true);
      try {
        const userOrders = await api.getUserOrders(user.id);
        setOrders(userOrders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user, activeTab]);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.updateProfile(user.id, profileData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePaymentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentFormData({
      ...paymentFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await api.addAddress(user.id, addressFormData);
      setAddresses(updatedUser.addresses || []);
      setShowAddressForm(false);
      setAddressFormData({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Slovakia',
        phone: '',
        isDefault: false
      });
      setSuccessMessage('Address added successfully!');
    } catch (err) {
      console.error('Failed to add address:', err);
      setError('Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address.id);
    setAddressFormData({ ...address });
    setShowAddressForm(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!user?.id || !editingAddress) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await api.updateAddress(user.id, editingAddress, addressFormData);
      setAddresses(updatedUser.addresses || []);
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressFormData({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Slovakia',
        phone: '',
        isDefault: false
      });
      setSuccessMessage('Address updated successfully!');
    } catch (err) {
      console.error('Failed to update address:', err);
      setError('Failed to update address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!user?.id || !window.confirm('Are you sure you want to delete this address?')) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await api.deleteAddress(user.id, addressId);
      setAddresses(updatedUser.addresses || []);
      setSuccessMessage('Address deleted successfully!');
    } catch (err) {
      console.error('Failed to delete address:', err);
      setError('Failed to delete address');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await api.addPaymentMethod(user.id, paymentFormData);
      setPaymentMethods(updatedUser.paymentMethods || []);
      setShowPaymentForm(false);
      setPaymentFormData({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cardholderName: '',
        isDefault: false
      });
      setSuccessMessage('Payment method added successfully!');
    } catch (err) {
      console.error('Failed to add payment method:', err);
      setError('Failed to add payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPaymentMethod = (payment) => {
    setEditingPayment(payment.id);
    setPaymentFormData({ ...payment });
    setShowPaymentForm(true);
  };

  const handleUpdatePaymentMethod = async (e) => {
    e.preventDefault();
    if (!user?.id || !editingPayment) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await api.updatePaymentMethod(user.id, editingPayment, paymentFormData);
      setPaymentMethods(updatedUser.paymentMethods || []);
      setShowPaymentForm(false);
      setEditingPayment(null);
      setPaymentFormData({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cardholderName: '',
        isDefault: false
      });
      setSuccessMessage('Payment method updated successfully!');
    } catch (err) {
      console.error('Failed to update payment method:', err);
      setError('Failed to update payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (!user?.id || !window.confirm('Are you sure you want to delete this payment method?')) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await api.deletePaymentMethod(user.id, methodId);
      setPaymentMethods(updatedUser.paymentMethods || []);
      setSuccessMessage('Payment method deleted successfully!');
    } catch (err) {
      console.error('Failed to delete payment method:', err);
      setError('Failed to delete payment method');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="account-page">
        <div className="container">
          <h1>My Account</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">
        <h1>My Account</h1>
        
        <div className="account-layout">
          <div className="account-sidebar">
            <nav className="account-nav">
              <button 
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button 
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                Order History
              </button>
              <button 
                className={activeTab === 'addresses' ? 'active' : ''}
                onClick={() => setActiveTab('addresses')}
              >
                Addresses
              </button>
              <button 
                className={activeTab === 'payment' ? 'active' : ''}
                onClick={() => setActiveTab('payment')}
              >
                Payment Methods
              </button>
              <button onClick={handleLogout}>
                Logout
              </button>
            </nav>
          </div>

          <div className="account-content">
            {activeTab === 'profile' && (
              <div className="account-section">
                <h2>Profile Information</h2>
                {error && (
                  <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', background: '#ffe6e6', borderRadius: '4px' }}>
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="success-message" style={{ color: 'green', marginBottom: '15px', padding: '10px', background: '#e6ffe6', borderRadius: '4px' }}>
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleSaveProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled
                      style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                    <small style={{ color: '#666', fontSize: '12px' }}>Email cannot be changed</small>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="+421 912 345 678"
                    />
                  </div>
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="account-section">
                <h2>Order History</h2>
                {ordersLoading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p>No orders yet. <button className="link-btn" onClick={() => navigate('/')}>Start Shopping</button></p>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => {
                      const itemCount = order.items?.length || 0;
                      const total = typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0);
                      return (
                        <div key={order.id} className="order-card">
                          <div className="order-header">
                            <div>
                              <span className="order-id">Order {order.orderNumber || order.id}</span>
                              <span className="order-date">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <div className="order-details">
                            <span>{itemCount} item(s)</span>
                            <span className="order-total">€{total.toFixed(2)}</span>
                          </div>
                          <button 
                            className="view-order-btn"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="account-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Saved Addresses</h2>
                  <button 
                    className="add-address-btn"
                    onClick={() => {
                      setShowAddressForm(!showAddressForm);
                      setEditingAddress(null);
                      setAddressFormData({
                        firstName: '',
                        lastName: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        country: 'Slovakia',
                        phone: '',
                        isDefault: false
                      });
                    }}
                  >
                    {showAddressForm ? 'Cancel' : '+ Add Address'}
                  </button>
                </div>

                {error && (
                  <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', background: '#ffe6e6', borderRadius: '4px' }}>
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="success-message" style={{ color: 'green', marginBottom: '15px', padding: '10px', background: '#e6ffe6', borderRadius: '4px' }}>
                    {successMessage}
                  </div>
                )}

                {showAddressForm && (
                  <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="address-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={addressFormData.firstName}
                          onChange={handleAddressInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={addressFormData.lastName}
                          onChange={handleAddressInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={addressFormData.address}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={addressFormData.city}
                          onChange={handleAddressInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Postal Code *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={addressFormData.postalCode}
                          onChange={handleAddressInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={addressFormData.country}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressFormData.phone}
                        onChange={handleAddressInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={addressFormData.isDefault}
                          onChange={handleAddressInputChange}
                        />
                        Set as default address
                      </label>
                    </div>
                    <button type="submit" className="submit-btn" disabled={saving}>
                      {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                    </button>
                  </form>
                )}

                <div className="addresses-list">
                  {addresses.length === 0 ? (
                    <p>No addresses saved yet.</p>
                  ) : (
                    addresses.map((address) => (
                      <div key={address.id} className="address-card">
                        <div className="address-header">
                          <h3>
                            {address.firstName} {address.lastName}
                            {address.isDefault && <span className="default-badge">Default</span>}
                          </h3>
                          <div>
                            <button className="edit-btn" onClick={() => handleEditAddress(address)}>
                              Edit
                            </button>
                            <button className="edit-btn" onClick={() => handleDeleteAddress(address.id)} style={{ marginLeft: '10px', color: '#e74c3c' }}>
                              Delete
                            </button>
                          </div>
                        </div>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.postalCode}</p>
                        <p>{address.country}</p>
                        {address.phone && <p>Phone: {address.phone}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="account-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Payment Methods</h2>
                  <button 
                    className="add-payment-btn"
                    onClick={() => {
                      setShowPaymentForm(!showPaymentForm);
                      setEditingPayment(null);
                      setPaymentFormData({
                        type: 'card',
                        last4: '',
                        expiryMonth: '',
                        expiryYear: '',
                        cardholderName: '',
                        isDefault: false
                      });
                    }}
                  >
                    {showPaymentForm ? 'Cancel' : '+ Add Payment Method'}
                  </button>
                </div>

                {error && (
                  <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', background: '#ffe6e6', borderRadius: '4px' }}>
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="success-message" style={{ color: 'green', marginBottom: '15px', padding: '10px', background: '#e6ffe6', borderRadius: '4px' }}>
                    {successMessage}
                  </div>
                )}

                {showPaymentForm && (
                  <form onSubmit={editingPayment ? handleUpdatePaymentMethod : handleAddPaymentMethod} className="payment-form">
                    <div className="form-group">
                      <label>Payment Type *</label>
                      <select
                        name="type"
                        value={paymentFormData.type}
                        onChange={handlePaymentInputChange}
                        required
                      >
                        <option value="card">Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                    {paymentFormData.type === 'card' && (
                      <>
                        <div className="form-group">
                          <label>Cardholder Name *</label>
                          <input
                            type="text"
                            name="cardholderName"
                            value={paymentFormData.cardholderName}
                            onChange={handlePaymentInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Card Number *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentFormData.cardNumber}
                            onChange={handlePaymentInputChange}
                            maxLength="19"
                            placeholder="1234 5678 9012 3456"
                            pattern="[0-9\s]{13,19}"
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Expiry Month *</label>
                            <select
                              name="expiryMonth"
                              value={paymentFormData.expiryMonth}
                              onChange={handlePaymentInputChange}
                              required
                            >
                              <option value="">Select Month</option>
                              <option value="01">01</option>
                              <option value="02">02</option>
                              <option value="03">03</option>
                              <option value="04">04</option>
                              <option value="05">05</option>
                              <option value="06">06</option>
                              <option value="07">07</option>
                              <option value="08">08</option>
                              <option value="09">09</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                              <option value="12">12</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Expiry Year *</label>
                            <input
                              type="number"
                              name="expiryYear"
                              value={paymentFormData.expiryYear}
                              onChange={handlePaymentInputChange}
                              min="2025"
                              placeholder="YYYY"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={paymentFormData.isDefault}
                          onChange={handlePaymentInputChange}
                        />
                        Set as default payment method
                      </label>
                    </div>
                    <button type="submit" className="submit-btn" disabled={saving}>
                      {saving ? 'Saving...' : (editingPayment ? 'Update Payment Method' : 'Add Payment Method')}
                    </button>
                  </form>
                )}

                <div className="payment-methods-list">
                  {paymentMethods.length === 0 ? (
                    <p>No payment methods saved yet.</p>
                  ) : (
                    paymentMethods.map((method) => (
                      <div key={method.id} className="address-card">
                        <div className="address-header">
                          <h3>
                            {method.type === 'card' ? 'Card' : method.type === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                            {method.isDefault && <span className="default-badge">Default</span>}
                          </h3>
                          <div>
                            <button className="edit-btn" onClick={() => handleEditPaymentMethod(method)}>
                              Edit
                            </button>
                            <button className="edit-btn" onClick={() => handleDeletePaymentMethod(method.id)} style={{ marginLeft: '10px', color: '#e74c3c' }}>
                              Delete
                            </button>
                          </div>
                        </div>
                        {method.type === 'card' && (
                          <>
                            {method.cardholderName && <p>Cardholder: {method.cardholderName}</p>}
                            {method.cardNumber && (
                              <p>Card: {method.cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()}</p>
                            )}
                            {method.expiryMonth && method.expiryYear && (
                              <p>Expires: {method.expiryMonth}/{method.expiryYear}</p>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

