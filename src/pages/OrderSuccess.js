import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const orderId = location.state?.orderId || 'ORD-' + Math.floor(Math.random() * 10000);

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1>{t('orderPlacedSuccessfully')}</h1>
          <p className="success-message">
            {t('thankYouOrder')}
          </p>
          <p className="order-number">
            {t('orderNumber')} <strong>{orderId}</strong>
          </p>
          <div className="success-actions">
            <button className="primary-btn" onClick={() => navigate('/account')}>
              {t('viewOrderHistory')}
            </button>
            <button className="secondary-btn" onClick={() => navigate('/')}>
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

