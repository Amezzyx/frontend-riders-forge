import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Shipping.css';

const Shipping = () => {
  const { t } = useLanguage();
  return (
    <div className="shipping-page">
      <div className="container">
        <div className="shipping-header">
          <h1>{t('shippingDelivery') || 'Shipping & Delivery'}</h1>
          <p className="shipping-subtitle">{t('shippingPageSubtitle') || 'Everything you need to know about delivery.'}</p>
        </div>

        <div className="shipping-content">
          <section>
            <h2>{t('shippingOptions') || 'Shipping Options'}</h2>
            <p>{t('shippingOptionsText') || 'We offer standard and express shipping. Choose the option that best fits your needs at checkout.'}</p>
            <ul>
              <li><strong>{t('standardShipping') || 'Standard Shipping'}</strong> – {t('standardShippingDesc') || '5–7 business days within Europe, 7–14 days internationally. €5.99 or free on orders over €50.'}</li>
              <li><strong>{t('expressShipping') || 'Express Shipping'}</strong> – {t('expressShippingDesc') || '2–3 business days. Available at checkout for an additional fee.'}</li>
            </ul>
          </section>

          <section>
            <h2>{t('freeShipping') || 'Free Shipping'}</h2>
            <p>{t('freeShippingText') || 'Free standard shipping on all orders over €50. No code needed – your order automatically qualifies at checkout.'}</p>
          </section>

          <section>
            <h2>{t('orderProcessing') || 'Order Processing'}</h2>
            <p>{t('orderProcessingText') || 'Orders are typically processed within 1–2 business days. You will receive an email confirmation with tracking information once your order has shipped.'}</p>
          </section>

          <section>
            <h2>{t('internationalShipping') || 'International Shipping'}</h2>
            <p>{t('internationalShippingText') || 'We ship worldwide to over 80 countries. Delivery times and customs may apply depending on your location. You are responsible for any import duties or taxes in your country.'}</p>
          </section>

          <section>
            <h2>{t('trackingYourOrder') || 'Tracking Your Order'}</h2>
            <p>{t('trackingText') || 'After your order ships, you will receive a tracking link by email. You can also view the status of your order in your account under Order History.'}</p>
          </section>

          <section>
            <h2>{t('contactInformation') || 'Contact'}</h2>
            <p>{t('shippingContactText') || 'Questions about shipping? Contact us at support@grenzgaenger-shop.com or visit our Contact page.'}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
