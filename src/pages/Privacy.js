import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Privacy.css';

const Privacy = () => {
  const { t } = useLanguage();
  return (
    <div className="privacy-page">
      <div className="container">
        <div className="privacy-header">
          <h1>{t('privacyPolicy')}</h1>
          <p className="last-updated">{t('lastUpdated')}</p>
        </div>

        <div className="privacy-content">
          <section>
            <h2>{t('introduction')}</h2>
            <p>
              {t('introductionText')}
            </p>
          </section>

          <section>
            <h2>{t('informationWeCollect')}</h2>
            <h3>{t('personalInformation')}</h3>
            <p>{t('personalInfoText')}</p>
            <ul>
              <li>{t('nameContact')}</li>
              <li>{t('paymentInfo')}</li>
              <li>{t('accountCredentials')}</li>
              <li>{t('communicationPrefs')}</li>
            </ul>

            <h3>{t('automaticallyCollected')}</h3>
            <p>{t('automaticallyCollectedText')}</p>
            <ul>
              <li>{t('ipDevice')}</li>
              <li>{t('browserType')}</li>
              <li>{t('pagesVisited')}</li>
              <li>{t('referralUrls')}</li>
              <li>{t('cookiesTracking')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('howWeUse')}</h2>
            <p>{t('howWeUseText')}</p>
            <ul>
              <li>{t('processOrders')}</li>
              <li>{t('communicateOrders')}</li>
              <li>{t('improveWebsite')}</li>
              <li>{t('marketing')}</li>
              <li>{t('preventFraud')}</li>
              <li>{t('legalObligations')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('dataSharing')}</h2>
            <p>
              {t('dataSharingText')}
            </p>
            <ul>
              <li>{t('serviceProviders')}</li>
              <li>{t('legalAuthorities')}</li>
              <li>{t('businessPartners')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('dataSecurity')}</h2>
            <p>
              {t('dataSecurityText')}
            </p>
          </section>

          <section>
            <h2>{t('yourRights')}</h2>
            <p>{t('yourRightsText')}</p>
            <ul>
              <li>{t('accessInfo')}</li>
              <li>{t('correctInfo')}</li>
              <li>{t('deleteInfo')}</li>
              <li>{t('objectProcessing')}</li>
              <li>{t('dataPortability')}</li>
              <li>{t('withdrawConsent')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('cookies')}</h2>
            <p>
              {t('cookiesText')}
            </p>
          </section>

          <section>
            <h2>{t('contactUsPrivacy')}</h2>
            <p>
              {t('contactUsPrivacyText')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

