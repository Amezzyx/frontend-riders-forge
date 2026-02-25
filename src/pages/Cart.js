import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const getStockForItem = (products, item) => {
  const product = products?.find(p => p.id === item.id);
  if (!product) return 0;
  if (product.sizeQuantities && typeof product.sizeQuantities === 'object' && item.size != null) {
    return Number(product.sizeQuantities[item.size]) || 0;
  }
  return Number(product.quantity) || 0;
};

const Cart = ({ cart, products = [], onRemoveItem, onUpdateQuantity }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price || 0);
    return sum + (price * item.quantity);
  }, 0);
  const shipping = total >= 50 ? 0 : 5.99;
  const finalTotal = total + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart</p>
            <button className="shop-now-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              {cart.map((item, index) => (
                <div key={index} className="cart-item-row">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} onClick={() => navigate(`/product/${item.id}`)} />
                    ) : (
                      <div className="cart-placeholder" onClick={() => navigate(`/product/${item.id}`)}></div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                    {item.size && <p className="item-size">Size: {item.size}</p>}
                    <p className="item-price">€{Number(item.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= getStockForItem(products, item)}
                        title={item.quantity >= getStockForItem(products, item) ? 'Maximum in stock' : ''}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-subtotal">
                      €{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveItem(index)}
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="free-shipping">Free</span>
                  ) : (
                    `€${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {total < 50 && (
                <div className="shipping-note">
                  Add €{(50 - total).toFixed(2)} more for free shipping!
                </div>
              )}
              <div className="summary-row total-row">
                <span>Total</span>
                <span>€{finalTotal.toFixed(2)}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

