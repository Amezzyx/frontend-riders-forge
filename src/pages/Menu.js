import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Menu.css';

const Menu = () => {
  const { t } = useLanguage();

  return (
    <div className="menu-page">
      <h1 className="menu-title">RIDERS FORGE</h1>
      <nav className="menu-nav">
        <Link to="/about" className="menu-item">{t('about') || 'O nás'}</Link>
        <Link to="/contact" className="menu-item">{t('contact') || 'Kontakt'}</Link>
        <Link to="/newsletter" className="menu-item">{t('newsletter') || 'Newsletter'}</Link>
      </nav>
    </div>
  );
};

export default Menu;



