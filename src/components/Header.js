import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import './Header.css';

const Header = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const closeMenu = () => setIsMenuOpen(false);

  const categories = {
    'Men': [
      { label: t('hoodiesSweaters'), slug: 'hoodies-&-sweaters' },
      { label: t('tshirts'), slug: 't-shirts' },
      { label: t('jackets'), slug: 'jackets' },
      { label: t('pants'), slug: 'pants' },
      { label: t('shorts'), slug: 'shorts' },
      { label: t('underwear'), slug: 'underwear' },
    ],
    'Women': [
      { label: t('sportsBrasBodysuits'), slug: 'sports-bras-&-bodysuits' },
      { label: t('womenHoodies'), slug: 'hoodies' },
      { label: t('leggings'), slug: 'leggings' },
      { label: t('sweatpants'), slug: 'sweatpants' },
    ],
    'MX Gear': [
      { label: t('mxGloves'), slug: 'gloves' },
      { label: t('mxGoggles'), slug: 'mx-goggles' },
      { label: t('mxPants'), slug: 'mx-pants' },
      { label: t('mxJerseys'), slug: 'mx-jerseys' },
      { label: t('helmets'), slug: 'helmets' },
      { label: t('bags'), slug: 'bags' },
      { label: t('protectors'), slug: 'protectors' },
    ],
    'Accessories': [],
    'Graphics': []
  };

  const categoryTranslations = {
    'Men': t('men'),
    'Women': t('women'),
    'MX Gear': t('mxGear'),
    'Accessories': t('accessories'),
    'Graphics': t('graphics'),
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-top-left">
              <div className="country-selector">Slovakia (EUR €)</div>
              <LanguageSelector />
            </div>
            <div className="header-links">
              <Link to="/contact">{t('helpContact')}</Link>
              {user ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin" className="user-name">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/account" className="user-name">
                      {user.name}
                    </Link>
                  )}
                  <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
                    {t('logout')}
                  </button>
                </>
              ) : (
                <button className="login-btn-header" onClick={() => navigate('/login')}>
                  {t('login')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="logo" onClick={closeMenu}>
              <div className="logo-container">
                <Logo width={45} height={45} />
                <h1>Riders Forge</h1>
              </div>
            </Link>

            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              {/* Desktop menu - categories with submenus */}
              {Object.keys(categories).map(category => (
                <li
                  key={category}
                  className="nav-item desktop-only"
                  onMouseEnter={() => setActiveCategory(category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={category === 'Graphics' ? '/graphics' : `/category/${category.toLowerCase().replace(' ', '-')}`}
                    onClick={closeMenu}
                  >
                    {categoryTranslations[category] || category}
                  </Link>
                  {activeCategory === category && categories[category].length > 0 && (
                    <ul className="submenu">
                      {categories[category].map(subItem => (
                        <li key={subItem.slug}>
                          <Link
                            to={`/category/${category.toLowerCase().replace(' ', '-')}/${subItem.slug}`}
                            onClick={closeMenu}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              {/* Mobile menu links */}
              {Object.keys(categories).map(category => (
                <li key={`mobile-${category}`} className="nav-item mobile-only">
                  <Link
                    to={category === 'Graphics' ? '/graphics' : `/category/${category.toLowerCase().replace(' ', '-')}`}
                    onClick={closeMenu}
                  >
                    {categoryTranslations[category] || category}
                  </Link>
                </li>
              ))}
              <li className="nav-item mobile-only">
                <Link to="/about" onClick={closeMenu}>{t('about') || 'O nás'}</Link>
              </li>
              <li className="nav-item mobile-only">
                <Link to="/contact" onClick={closeMenu}>{t('contact') || 'Kontakt'}</Link>
              </li>
            </ul>

            <div className="navbar-actions">
              <div className={`search-wrap ${searchOpen ? 'open' : ''}`}>
                <form
                  className="search-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = searchQuery.trim();
                    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <input
                    type="search"
                    className="search-input"
                    placeholder={t('search') || 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery.trim() && setSearchOpen(false)}
                    autoFocus={searchOpen}
                    aria-label="Search"
                  />
                  <button type="submit" className="search-submit" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </button>
                </form>
              </div>
              {!searchOpen && (
                <button className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
              )}
              <button className="cart-btn" onClick={onCartClick} aria-label="Shopping Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button
                className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
