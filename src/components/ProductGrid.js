import React from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import './ProductGrid.css';

const ProductGrid = ({ products, title, onAddToCart }) => {
  const { t } = useLanguage();
  if (!products || products.length === 0) {
    return null;
  }

  // For highlights section with 7 products, center the last 3
  const highlightsTitle = t('highlights') || 'Highlights';
  const isHighlights = (title === 'Highlights' || title === highlightsTitle) && products.length === 7;
  const firstFour = isHighlights ? products.slice(0, 4) : [];
  const lastThree = isHighlights ? products.slice(4, 7) : [];

  return (
    <section className="product-grid-section">
      <div className="container">
        {title && <h2 className="section-title">{title === 'Highlights' ? (t('highlights') || 'Highlights') : title === 'All Products' ? (t('allProducts') || 'All Products') : title}</h2>}
        {isHighlights ? (
          <>
            <div className="product-grid">
              {firstFour.map((product, index) => (
                <ProductCard
                  key={product.id || index}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
            <div className="product-grid product-grid-centered">
              {lastThree.map((product, index) => (
                <ProductCard
                  key={product.id || index + 4}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard
                key={product.id || index}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;

