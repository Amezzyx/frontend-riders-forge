import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Checkout.css';

const Checkout = ({ cart, onOrderPlaced }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Slovakia',
    phone: '',
    paymentMethod: 'card'
  });
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Load user data if logged in: use saved address (default or first) to auto-fill checkout
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id && !userDataLoaded) {
        try {
          const userData = await api.getUser(user.id);
          const savedAddresses = userData.addresses || [];
          const addressToUse = savedAddresses.length > 0
            ? (savedAddresses.find(a => a.isDefault) || savedAddresses[0])
            : null;

          if (addressToUse) {
            setFormData(prev => ({
              ...prev,
              email: userData.email || prev.email,
              firstName: addressToUse.firstName || prev.firstName,
              lastName: addressToUse.lastName || prev.lastName,
              phone: addressToUse.phone || userData.phone || prev.phone,
              address: addressToUse.address || prev.address,
              city: addressToUse.city || prev.city,
              postalCode: addressToUse.postalCode || prev.postalCode,
              country: addressToUse.country || prev.country,
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              email: userData.email || prev.email,
              firstName: userData.firstName || prev.firstName,
              lastName: userData.lastName || prev.lastName,
              phone: userData.phone || prev.phone,
              address: userData.address || prev.address,
              city: userData.city || prev.city,
              postalCode: userData.postalCode || prev.postalCode,
              country: userData.country || prev.country,
            }));
          }
          setUserDataLoaded(true);
        } catch (err) {
          console.error('Failed to load user data for checkout:', err);
        }
      }
    };
    loadUserData();
  }, [user, userDataLoaded]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        userId: user?.id || null,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        total: total.toFixed(2),
        status: 'Pending',
        items: cart.map(item => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        })),
      };

      const order = await api.createOrder(orderData);
      
      // Call callback to refresh products if provided
      if (onOrderPlaced) {
        onOrderPlaced();
      }
      
      navigate('/order-success', { state: { orderId: order.orderNumber || order.id } });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.message || (t('placeOrderError') || 'Failed to place order. Please try again.'));
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>{t('yourCartIsEmpty') || 'Your cart is empty'}</h2>
        <button onClick={() => navigate('/cart')}>{t('returnToCart') || 'Return to Cart'}</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>{t('checkout') || 'Checkout'}</h1>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '20px', padding: '15px', background: '#ffe6e6', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-layout">
            <div className="checkout-main">
              <section className="checkout-section">
                <h2>{t('contactInformation') || 'Contact Information'}</h2>
                <div className="form-group">
                  <label>{t('emailLabel') || 'Email'} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('phone') || 'Phone'}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </section>

              <section className="checkout-section">
                <h2>{t('shippingAddress') || 'Shipping Address'}</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('firstName') || 'First Name'} *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('lastName') || 'Last Name'} *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('address') || 'Address'} *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('city') || 'City'} *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('postalCode') || 'Postal Code'} *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('country') || 'Country'} *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option>Slovakia</option>
                    <option>Czech Republic</option>
                    <option>Austria</option>
                    <option>Germany</option>
                    <option>Poland</option>
                  </select>
                </div>
              </section>

              <section className="checkout-section">
                <h2>{t('paymentMethod') || 'Payment Method'}</h2>
                <div className="payment-methods">
                  <label className={`payment-option ${formData.paymentMethod === 'card' ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <span>{t('creditDebitCard') || 'Credit/Debit Card'}</span>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'paypal' ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <span>{t('paypal') || 'PayPal'}</span>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'bank' ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleInputChange}
                    />
                    <span>{t('bankTransfer') || 'Bank Transfer'}</span>
                  </label>
                </div>
              </section>
            </div>

            <div className="checkout-sidebar">
              <div className="order-summary">
                <h2>{t('orderSummary') || 'Order Summary'}</h2>
                <div className="order-items">
                  {cart.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        {item.size && <span className="order-item-size">{t('size') || 'Size'}: {item.size}</span>}
                        <span className="order-item-quantity">{t('quantity') || 'Qty'}: {item.quantity}</span>
                      </div>
                      <span className="order-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-totals">
                  <div className="total-row">
                    <span>{t('subtotal') || 'Subtotal'}</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>{t('shipping') || 'Shipping'}</span>
                    <span>{shipping === 0 ? (t('free') || 'Free') : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="total-row final-total">
                    <span>{t('total') || 'Total'}</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
                <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                  {isSubmitting ? (t('placingOrder') || 'Placing Order...') : (t('placeOrder') || 'Place Order')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

