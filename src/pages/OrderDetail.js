import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const orderData = await api.getOrder(id, user.id);
        
        // Verify the order belongs to the current user
        if (orderData.userId && orderData.userId !== user.id) {
          setError(t('noPermissionViewOrder') || 'You do not have permission to view this order.');
          setLoading(false);
          return;
        }

        setOrder(orderData);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError(err.message || (t('failedToLoadOrder') || 'Failed to load order details.'));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <p>{t('loadingOrderDetails') || 'Loading order details...'}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>{error || (t('orderNotFound') || 'Order not found')}</h2>
            <button onClick={() => navigate('/account')} className="back-btn">
              {t('backToAccount') || 'Back to Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0);

  const formatPaymentMethod = (method) => {
    if (!method) return t('notSpecified') || 'Not specified';
    const methodMap = {
      'card': t('creditDebitCard') || 'Card',
      'paypal': t('paypal') || 'PayPal',
      'bank': t('bankTransfer') || 'Bank Transfer'
    };
    return methodMap[method.toLowerCase()] || method.charAt(0).toUpperCase() + method.slice(1);
  };

  return (
    <div className="order-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/account')}>
          ← {t('backToAccount') || 'Back to Account'}
        </button>

        <div className="order-detail-header">
          <h1>{t('orderDetails') || 'Order Details'}</h1>
          <div className="order-number">
            {t('orderNumber') || 'Order Number'}: <strong>{order.orderNumber || order.id}</strong>
          </div>
        </div>

        <div className="order-detail-content">
          <div className="order-info-section">
            <div className="info-card">
              <h3>{t('orderStatus') || 'Order Status'}</h3>
              <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                {order.status || 'Pending'}
              </span>
            </div>

            <div className="info-card">
              <h3>{t('orderDate') || 'Order Date'}</h3>
              <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>

            <div className="info-card">
              <h3>{t('totalAmount') || 'Total Amount'}</h3>
              <p className="total-amount">€{total.toFixed(2)}</p>
            </div>
          </div>

          <div className="shipping-info-section">
            <h2>{t('shippingAddress') || 'Shipping Address'}</h2>
            <div className="address-box">
              <p><strong>{order.firstName} {order.lastName}</strong></p>
              <p>{order.address}</p>
              <p>{order.city}, {order.postalCode}</p>
              <p>{order.country}</p>
              {order.phone && <p>{t('phone') || 'Phone'}: {order.phone}</p>}
              <p>{t('email') || 'Email'}: {order.email}</p>
            </div>
          </div>

          <div className="order-items-section">
            <h2>{t('orderItems') || 'Order Items'}</h2>
            <div className="items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.productName || item.name} />
                      ) : (
                        <div className="item-placeholder">
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="item-info">
                      <h4>{item.productName || item.name}</h4>
                      {item.size && (
                        <p className="item-size">{t('size') || 'Size'}: {item.size}</p>
                      )}
                      <p className="item-quantity">{t('quantity') || 'Quantity'}: {item.quantity || 1}</p>
                    </div>
                    <div className="item-price">
                      €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p>{t('noItemsInOrder') || 'No items in this order.'}</p>
              )}
            </div>
          </div>

          <div className="payment-info-section">
            <h2>{t('paymentMethod') || 'Payment Method'}</h2>
            <p>{formatPaymentMethod(order.paymentMethod)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

