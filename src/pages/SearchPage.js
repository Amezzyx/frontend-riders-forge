import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../context/LanguageContext';
import './SearchPage.css';

const SearchPage = ({ products, onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const searchResults = q
    ? products.filter(p => {
        const name = (p.name || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const sub = (p.subcategory || '').toLowerCase();
        const term = q;
        return name.includes(term) || category.includes(term) || desc.includes(term) || sub.includes(term);
      })
    : [];

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-page-header">
          <h1>{t('searchResults') || 'Search Results'}</h1>
          {q && (
            <p className="search-query">
              {searchResults.length === 0
                ? (t('noResultsFor') || 'No results for') + ` "${searchParams.get('q')}"`
                : `${searchResults.length} ${t('resultsFor') || 'results for'} "${searchParams.get('q')}"`}
            </p>
          )}
        </div>
        {!q ? (
          <p className="search-empty-msg">{t('enterSearchQuery') || 'Enter a search term above to find products.'}</p>
        ) : searchResults.length === 0 ? (
          <p className="search-no-results">{t('noResultsFor') || 'No results for'} "{searchParams.get('q')}"</p>
        ) : (
          <ProductGrid products={searchResults} onAddToCart={onAddToCart} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
