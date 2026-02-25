import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      setShowSizeGuide(true);
      return;
    }
    // Check if selected size is out of stock
    if (selectedSize && isSizeOutOfStock(selectedSize)) {
      setShowSizeGuide(true);
      return;
    }
    onAddToCart(product, selectedSize);
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

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-image" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-placeholder">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        {isOutOfStock ? (
          <span className="badge out-of-stock-badge">{t('outOfStock') || 'Out of Stock'}</span>
        ) : discount ? (
          <span className="badge discount">-{discount}%</span>
        ) : product.isNew ? (
          <span className="badge new">{t('new') || 'New'}</span>
        ) : null}
      </div>

      <div className="product-info">
        <h3 className="product-name" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-sizes">
            <label>{t('size') || 'Size'}:</label>
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
                        setShowSizeGuide(false);
                      }
                    }}
                    disabled={sizeOutOfStock}
                    title={sizeOutOfStock ? (t('outOfStock') || 'Out of Stock') : `${sizeStock} ${t('inStock') || 'in stock'}`}
                  >
                    {size}
                    {sizeOutOfStock && <span className="size-out-of-stock-indicator">×</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showSizeGuide && (
          <div className="size-guide-message">
            {t('pleaseSelectSize') || 'Please select a size'}
          </div>
        )}

        <div className="product-price">
          <span className="current-price">€{Number(product.price || 0).toFixed(2)}</span>
          {product.regularPrice && (
            <>
              <span className="regular-price">€{Number(product.regularPrice || 0).toFixed(2)}</span>
              <span className="savings">
                {t('save') || 'Save'} €{(Number(product.regularPrice || 0) - Number(product.price || 0)).toFixed(2)}
              </span>
            </>
          )}
        </div>

        <button 
          className={`add-to-cart-btn ${(isOutOfStock || selectedSizeOutOfStock) ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || selectedSizeOutOfStock}
        >
          {(isOutOfStock || selectedSizeOutOfStock) ? (t('outOfStock') || 'Out of Stock') : (t('addToCart') || 'Add to Cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

