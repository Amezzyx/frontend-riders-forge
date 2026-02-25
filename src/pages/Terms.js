import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Terms.css';

const Terms = () => {
  const { t } = useLanguage();
  return (
    <div className="terms-page">
      <div className="container">
        <div className="terms-header">
          <h1>{t('termsOfService')}</h1>
          <p className="last-updated">{t('lastUpdated')}</p>
        </div>

        <div className="terms-content">
          <section>
            <h2>{t('acceptanceOfTerms')}</h2>
            <p>
              {t('acceptanceText')}
            </p>
          </section>

          <section>
            <h2>{t('useLicense')}</h2>
            <p>
              {t('useLicenseText')}
            </p>
            <ul>
              <li>{t('modifyCopy')}</li>
              <li>{t('commercialUse')}</li>
              <li>{t('decompile')}</li>
              <li>{t('removeCopyright')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('productsPricing')}</h2>
            <p>
              {t('productsPricingText')}
            </p>
          </section>

          <section>
            <h2>{t('ordersPayment')}</h2>
            <p>
              {t('ordersPaymentText')}
            </p>
          </section>

          <section>
            <h2>{t('shippingDeliveryTerms')}</h2>
            <p>
              {t('shippingDeliveryText')}
            </p>
          </section>

          <section>
            <h2>{t('returnsRefunds')}</h2>
            <p>
              {t('returnsRefundsText')}
            </p>
          </section>

          <section>
            <h2>{t('limitationLiability')}</h2>
            <p>
              {t('limitationLiabilityText')}
            </p>
          </section>

          <section>
            <h2>{t('privacyPolicyTerms')}</h2>
            <p>
              {t('privacyPolicyTermsText')}
            </p>
          </section>

          <section>
            <h2>{t('contactInformation')}</h2>
            <p>
              {t('contactInformationText')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

