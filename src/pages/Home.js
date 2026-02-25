import React from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../context/LanguageContext';

const Home = ({ products, onAddToCart }) => {
  const { t } = useLanguage();
  const highlightedProducts = products.slice(0, 7);
  
  return (
    <>
      <Hero />
      <ProductGrid 
        products={highlightedProducts}
        title={t('highlights') || 'Highlights'}
        onAddToCart={onAddToCart}
      />
      <ProductGrid 
        products={products}
        title={t('allProducts') || 'All Products'}
        onAddToCart={onAddToCart}
      />
    </>
  );
};

export default Home;

