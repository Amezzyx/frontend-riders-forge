import React from 'react';
import './ShoppingCart.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';


const ShoppingCart = ({ cart, isOpen, onClose, onRemoveItem, onUpdateQuantity }) => {
  const { t } = useLanguage();
  // Convert price strings to numbers (PostgreSQL returns decimals as strings)
  const total = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (price * item.quantity);
  }, 0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="shopping-cart">
        <div className="cart-header">
          <h2>{t('shoppingCart')}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>{t('yourCartIsEmpty')}</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f5f5f5"/%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="cart-placeholder"></div>
                      )}
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      {item.size && <p className="cart-item-size">{t('size')}: {item.size}</p>}
                      <p className="cart-item-price">€{(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(index, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => onRemoveItem(index)}
                        aria-label={t('remove')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>{t('total')}:</span>
                  <span className="total-amount">€{total.toFixed(2)}</span>
                </div>
                <button className="checkout-btn"onClick={(e) => {
    e.stopPropagation();  
    onClose();             
    navigate('/checkout'); 
  }}
>
                  {t('proceedToCheckout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;

