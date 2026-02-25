import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Newsletter.css';

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="newsletter-page">
      <div className="container">
        <div className="newsletter-header">
          <h1>{t('newsletter') || 'Newsletter'}</h1>
          <p>{t('newsletterPageSubtitle') || 'Stay updated with our latest news, exclusive offers, and product launches.'}</p>
        </div>

        <div className="newsletter-content">
          <div className="newsletter-info">
            <h2>{t('whySubscribe') || 'Why Subscribe?'}</h2>
            <ul>
              <li>{t('newsletterBenefit1') || 'Get exclusive discounts and special offers'}</li>
              <li>{t('newsletterBenefit2') || 'Be the first to know about new product launches'}</li>
              <li>{t('newsletterBenefit3') || 'Receive tips and guides for riders'}</li>
              <li>{t('newsletterBenefit4') || 'Stay informed about events and promotions'}</li>
            </ul>
          </div>

          <div className="newsletter-form-section">
            <h2>{t('subscribeNow') || 'Subscribe Now'}</h2>
            {subscribed ? (
              <div className="success-message">
                <p>{t('newsletterSuccess') || 'Thank you for subscribing to our newsletter!'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form-page">
                <div className="form-group">
                  <label htmlFor="email">{t('email') || 'Email Address'}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder') || 'Enter your email address'}
                    required
                  />
                </div>
                <button type="submit" className="subscribe-btn">
                  {t('subscribe') || 'Subscribe'}
                </button>
              </form>
            )}
          </div>

          <div className="newsletter-privacy">
            <p>{t('newsletterPrivacy') || 'We respect your privacy. You can unsubscribe at any time.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;

