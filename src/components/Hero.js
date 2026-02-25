import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{t('heroTitle')}</h1>
        <p className="hero-subtitle">{t('heroSubtitle')}</p>
        <div className="hero-buttons">
          <Link to="/category/men" className="hero-btn primary">{t('shopMen')}</Link>
          <Link to="/category/women" className="hero-btn secondary">{t('shopWomen')}</Link>
        </div>
      </div>
      <div className="hero-highlights">
        <div className="highlight-item">
          <strong>Skull Hoodie</strong>
          <span>From €70</span>
        </div>
        <div className="highlight-item">
          <strong>Skull Tee</strong>
          <span>From €35</span>
        </div>
        <div className="highlight-item">
          <strong>Gloves</strong>
          <span>MX Gear</span>
        </div>
        <div className="highlight-item">
          <strong>Backpack</strong>
          <span>New Collection</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

