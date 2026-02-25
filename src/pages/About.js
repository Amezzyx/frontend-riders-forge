import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>{t('aboutRidersForge')}</h1>
          <p className="about-tagline">{t('premiumGearForRiders')}</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>{t('ourStory')}</h2>
            <p>
              {t('ourStoryText1')}
            </p>
            <p>
              {t('ourStoryText2')}
            </p>
          </section>

          <section className="about-section">
            <h2>{t('ourMission')}</h2>
            <p>
              {t('ourMissionText1')}
            </p>
            <p>
              {t('ourMissionText2')}
            </p>
          </section>

          <section className="about-section">
            <h2>{t('whatWeOffer')}</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>{t('premiumQuality')}</h3>
                <p>{t('premiumQualityDesc')}</p>
              </div>
              <div className="feature-card">
                <h3>{t('globalShipping')}</h3>
                <p>{t('globalShippingDesc')}</p>
              </div>
              <div className="feature-card">
                <h3>{t('communityDriven')}</h3>
                <p>{t('communityDrivenDesc')}</p>
              </div>
              <div className="feature-card">
                <h3>{t('customerFirst')}</h3>
                <p>{t('customerFirstDesc')}</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>{t('joinOurCommunity')}</h2>
            <p>
              {t('joinCommunityText')}
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">{t('facebook')}</a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">{t('instagram')}</a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">{t('twitter')}</a>
              <a href="https://youtube.com" className="social-link" target="_blank" rel="noopener noreferrer">{t('youtube')}</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;

