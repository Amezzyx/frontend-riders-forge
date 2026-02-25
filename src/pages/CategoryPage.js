import React from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import './CategoryPage.css';

// ESLint cache fix

const CategoryPage = ({ products, onAddToCart }) => {
  const { category, subcategory } = useParams();

  // Same slug format as Header: toLowerCase + spaces to single dash (e.g. "Hoodies & Sweaters" → "hoodies-&-sweaters")
  const toSubSlug = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-');

  const slugToCategory = {
    'men': 'Men',
    'women': 'Women',
    'mx-gear': 'MX Gear',
    'accessories': 'Accessories',
    'graphics': 'Graphics',
  };
  const catLower = category?.toLowerCase();
  const expectedCategory = slugToCategory[catLower];

  const categoryProducts = products.filter(p => {
    const productCat = (p.category || '').toString().trim();
    const productCatNorm = productCat.toLowerCase().replace(/\s+/g, ' ');
    const expectedNorm = expectedCategory ? expectedCategory.toLowerCase().replace(/\s+/g, ' ') : '';
    if (expectedCategory == null || productCatNorm !== expectedNorm) return false;
    if (subcategory) {
      const slugNorm = toSubSlug(subcategory);
      const productNorm = toSubSlug(p.subcategory || '');
      if (productNorm !== '' && productNorm === slugNorm) return true;
      if (productNorm === '') {
        const name = (p.name || '').toLowerCase();
        const slugWords = slugNorm.split('-').filter(w => w.length > 1 && w !== '&');
        const matchByName = slugWords.some(w => name.includes(w) || name.includes(w.replace(/s$/, '')));
        if (matchByName) return true;
      }
      return false;
    }
    return true;
  });

  const categoryName = subcategory
    ? subcategory.replace(/-/g, ' ').replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : (category?.charAt(0).toUpperCase() + category?.slice(1).replace(/-/, ' ') || '');

  // Subcategory page (e.g. MX Jerseys): show only products in that subcategory.
  // Category page (e.g. MX Gear): show all products in that category.
  const showProducts = categoryProducts;
  const noSubcategoryProducts = subcategory && categoryProducts.length === 0;

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryName}</h1>
        <p>{showProducts.length} products found</p>
        {noSubcategoryProducts && (
          <p className="category-fallback-msg">No products in this subcategory yet. Assign subcategories in Admin (Products → Assign subcategories).</p>
        )}
      </div>
      <ProductGrid 
        products={showProducts}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

export default CategoryPage;

