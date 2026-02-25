import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Payment.css';

const Payment = () => {
  const { t } = useLanguage();
  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>{t('paymentMethods')}</h1>
        </div>

        <div className="payment-content">
          <section>
            <h2>{t('acceptedPaymentMethods')}</h2>
            <p>
              {t('acceptedPaymentMethodsText')}
            </p>
            <ul>
              <li>{t('paymentMethod1')}</li>
              <li>{t('paymentMethod2')}</li>
              <li>{t('paymentMethod3')}</li>
              <li>{t('paymentMethod4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('paymentSecurity')}</h2>
            <p>
              {t('paymentSecurityText')}
            </p>
          </section>

          <section>
            <h2>{t('paymentProcessing')}</h2>
            <p>
              {t('paymentProcessingText')}
            </p>
          </section>

          <section>
            <h2>{t('contactInformation')}</h2>
            <p>
              {t('paymentContactText')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Payment;





