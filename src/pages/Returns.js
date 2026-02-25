import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Returns.css';

const Returns = () => {
  const { t } = useLanguage();
  return (
    <div className="returns-page">
      <div className="container">
        <div className="returns-header">
          <h1>{t('returnsExchanges')}</h1>
        </div>

        <div className="returns-content">
          <section>
            <h2>{t('returnPolicy')}</h2>
            <p>
              {t('returnPolicyText')}
            </p>
          </section>

          <section>
            <h2>{t('howToReturn')}</h2>
            <ol>
              <li>{t('returnInstruction1')}</li>
              <li>{t('returnInstruction2')}</li>
              <li>{t('returnInstruction3')}</li>
              <li>{t('returnInstruction4')}</li>
            </ol>
          </section>

          <section>
            <h2>{t('returnConditions')}</h2>
            <ul>
              <li>{t('returnCondition1')}</li>
              <li>{t('returnCondition2')}</li>
              <li>{t('returnCondition3')}</li>
              <li>{t('returnCondition4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('refundTimeline')}</h2>
            <p>
              {t('refundTimelineText')}
            </p>
          </section>

          <section>
            <h2>{t('contactInformation')}</h2>
            <p>
              {t('returnsContactText')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Returns;





