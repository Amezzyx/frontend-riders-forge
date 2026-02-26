import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>RIDERS FORGE</h3>
            <ul>
              <li><Link to="/about">{t('about')}</Link></li>
              <li><Link to="/contact">{t('contact')}</Link></li>
              <li><Link to="/newsletter">{t('newsletter')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('information')}</h3>
            <ul>
              <li><Link to="/terms">{t('terms')}</Link></li>
              <li><Link to="/refund">{t('refundPolicy')}</Link></li>
              <li><Link to="/privacy">{t('privacy')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('helpContact')}</h3>
            <ul>
              <li><Link to="/contact">{t('customerService')}</Link></li>
              <li><Link to="/faq">{t('faq')}</Link></li>
              <li><Link to="/payment">{t('payment')}</Link></li>
              <li><Link to="/returns">{t('returns')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('contact')}</h3>
            <ul>
              <li>{t('phone')}: +421 912 123 456</li>
              <li>{t('email')}: support@ridersforge.com</li>
              <li>{t('businessHours')}: Mon-Fri: 09:00 - 16:00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Riders Forge. {t('allRightsReserved')}.</p>
          <p className="footer-credit">
            {t('imageCredit')} {t('imageCreditFrom')}{' '}
            <a href="https://grenzgaenger-shop.com" target="_blank" rel="noopener noreferrer">grenzgaenger-shop.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

