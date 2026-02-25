import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Check if selected size is out of stock
    if (selectedSize && isSizeOutOfStock(selectedSize)) {
      alert('This size is out of stock');
      return;
    }
    
    // Check if quantity exceeds available stock
    if (selectedSize && quantity > selectedSizeStock) {
      alert(`Only ${selectedSizeStock} available in this size`);
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedSize);
    }
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const discount = product.regularPrice 
    ? Math.round(((Number(product.regularPrice) - Number(product.price)) / Number(product.regularPrice)) * 100)
    : null;
  
  // Check stock per size
  const getSizeStock = (size) => {
    if (product.sizeQuantities && typeof product.sizeQuantities === 'object') {
      return product.sizeQuantities[size] || 0;
    }
    // Fallback to total quantity if no size-specific stock
    return product.quantity || 0;
  };

  const isSizeOutOfStock = (size) => {
    return getSizeStock(size) <= 0;
  };

  // Check if product is completely out of stock (all sizes)
  const isCompletelyOutOfStock = () => {
    if (product.sizes && product.sizes.length > 0) {
      if (product.sizeQuantities && typeof product.sizeQuantities === 'object') {
        // Check if all sizes are out of stock
        return product.sizes.every(size => isSizeOutOfStock(size));
      }
    }
    // Fallback to total quantity
    return (product.quantity || 0) <= 0;
  };

  const isOutOfStock = isCompletelyOutOfStock();
  const selectedSizeOutOfStock = selectedSize ? isSizeOutOfStock(selectedSize) : false;
  const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : 0;

  return (
    <div className={`product-detail ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <div className="product-detail-content">
          <div className="product-image-section">
            <div className="main-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="image-placeholder">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
              {isOutOfStock ? (
                <span className="badge out-of-stock-badge">Out of Stock</span>
              ) : discount ? (
                <span className="badge discount">-{discount}%</span>
              ) : product.isNew ? (
                <span className="badge new">New</span>
              ) : null}
            </div>
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <div className="product-category">{product.category}</div>
            
            <div className="product-price-section">
              <span className="current-price">€{Number(product.price || 0).toFixed(2)}</span>
              {product.regularPrice && (
                <>
                  <span className="regular-price">€{Number(product.regularPrice || 0).toFixed(2)}</span>
                  <span className="savings">Save €{(Number(product.regularPrice || 0) - Number(product.price || 0)).toFixed(2)}</span>
                </>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <label>Size:</label>
                <div className="size-options">
                  {product.sizes.map(size => {
                    const sizeStock = getSizeStock(size);
                    const sizeOutOfStock = isSizeOutOfStock(size);
                    return (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''} ${sizeOutOfStock ? 'disabled' : ''}`}
                        onClick={() => {
                          if (!sizeOutOfStock) {
                            setSelectedSize(size);
                            setQuantity(1); // Reset quantity when changing size
                          }
                        }}
                        disabled={sizeOutOfStock}
                        title={sizeOutOfStock ? 'Out of Stock' : `${sizeStock} in stock`}
                      >
                        {size}
                        {sizeOutOfStock && <span className="size-out-of-stock-indicator">×</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!isOutOfStock && !selectedSizeOutOfStock && (
              <div className="quantity-selection">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}>+</button>
                </div>
                {selectedSize && selectedSizeStock > 0 && (
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    {selectedSizeStock} available in {selectedSize}
                  </small>
                )}
              </div>
            )}

            <button 
              className={`add-to-cart-btn ${addedToCart ? 'added' : ''} ${(isOutOfStock || selectedSizeOutOfStock) ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock || selectedSizeOutOfStock}
            >
              {(isOutOfStock || selectedSizeOutOfStock) ? 'Out of Stock' : (addedToCart ? '✓ Added to Cart!' : 'Add to Cart')}
            </button>

            <div className="product-description">
              <h3>Description</h3>
              <p>
                Premium quality {product.name.toLowerCase()} from our {product.category} collection. 
                Made with high-quality materials and attention to detail. Perfect for everyday wear 
                or special occasions.
              </p>
              <ul>
                <li>High-quality materials</li>
                <li>Comfortable fit</li>
                <li>Durable construction</li>
                <li>Easy care</li>
              </ul>
            </div>

            <div className="shipping-info">
              <h3>Shipping & Returns</h3>
              <p>Free shipping on orders over €50. Easy returns within 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

