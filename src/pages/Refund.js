import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Refund.css';

const Refund = () => {
  const { t } = useLanguage();
  return (
    <div className="refund-page">
      <div className="container">
        <div className="refund-header">
          <h1>{t('refundPolicy')}</h1>
          <p className="last-updated">{t('lastUpdated')}</p>
        </div>

        <div className="refund-content">
          <section>
            <h2>{t('refundPolicyTitle')}</h2>
            <p>
              {t('refundPolicyText')}
            </p>
          </section>

          <section>
            <h2>{t('returnEligibility')}</h2>
            <p>
              {t('returnEligibilityText')}
            </p>
            <ul>
              <li>{t('returnCondition1')}</li>
              <li>{t('returnCondition2')}</li>
              <li>{t('returnCondition3')}</li>
              <li>{t('returnCondition4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('returnProcess')}</h2>
            <p>
              {t('returnProcessText')}
            </p>
            <ol>
              <li>{t('returnStep1')}</li>
              <li>{t('returnStep2')}</li>
              <li>{t('returnStep3')}</li>
              <li>{t('returnStep4')}</li>
            </ol>
          </section>

          <section>
            <h2>{t('refundTimeline')}</h2>
            <p>
              {t('refundTimelineText')}
            </p>
          </section>

          <section>
            <h2>{t('nonRefundableItems')}</h2>
            <p>
              {t('nonRefundableItemsText')}
            </p>
            <ul>
              <li>{t('nonRefundable1')}</li>
              <li>{t('nonRefundable2')}</li>
              <li>{t('nonRefundable3')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('contactInformation')}</h2>
            <p>
              {t('refundContactText')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Refund;





