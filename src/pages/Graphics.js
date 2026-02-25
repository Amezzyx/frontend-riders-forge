import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Graphics.css';

const Graphics = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bikeModel: '',
    bikeYear: '',
    designType: '',
    designDescription: '',
    budget: '',
    timeline: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      await api.createGraphicsRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        bikeModel: formData.bikeModel.trim(),
        bikeYear: formData.bikeYear.trim() || undefined,
        designType: formData.designType || undefined,
        designDescription: formData.designDescription.trim() || undefined,
        budget: formData.budget || undefined,
        timeline: formData.timeline || undefined,
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        bikeModel: '',
        bikeYear: '',
        designType: '',
        designDescription: '',
        budget: '',
        timeline: '',
      });
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="graphics-page">
      <div className="graphics-hero">
        <div className="container">
          <div className="graphics-header">
            <span className="graphics-badge">{t('graphics') || 'Graphics'}</span>
            <h1>{t('graphicsTitle') || 'Custom Motorcycle Graphics Design'}</h1>
            <p className="graphics-subtitle">{t('graphicsSubtitle') || 'Transform your bike with personalized graphics designed just for you'}</p>
          </div>
        </div>
      </div>

      <div className="container graphics-body">
        <div className="graphics-description">
          <p>{t('graphicsDescription') || 'At Riders Forge, we specialize in creating custom motorcycle graphics that reflect your unique style and personality.'}</p>
        </div>

        <div className="graphics-form-section">
          <div className="graphics-form-header">
            <h2>{t('graphicsFormTitle') || 'Graphics Design Request Form'}</h2>
            <p className="form-intro">{t('contactUsToday') || 'Contact us today to discuss your custom motorcycle graphics project.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="graphics-form">
            <fieldset className="form-block">
              <legend>{t('contactInformation') || 'Contact Information'}</legend>
              <div className="form-row">
              <div className="form-group">
                <label>{t('fullName') || 'Full Name'} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('namePlaceholder') || 'John Doe'}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('emailLabel') || 'Email'} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              </div>
              <div className="form-group">
                <label>{t('phoneNumber') || 'Phone'}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('phonePlaceholder') || '+421 912 123 456'}
              />
            </div>
            </fieldset>

            <fieldset className="form-block">
              <legend>{t('bikeInformation') || 'Bike Information'}</legend>
              <div className="form-row">
              <div className="form-group">
                <label>{t('bikeModel') || 'Bike Model'} *</label>
                <input
                  type="text"
                  name="bikeModel"
                  value={formData.bikeModel}
                  onChange={handleInputChange}
                  placeholder={t('bikeModelPlaceholder') || 'e.g., Yamaha YZ450F'}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('bikeYear') || 'Bike Year'}</label>
                <input
                  type="text"
                  name="bikeYear"
                  value={formData.bikeYear}
                  onChange={handleInputChange}
                  placeholder={t('bikeYearPlaceholder') || 'e.g., 2023'}
                />
              </div>
            </div>
            </fieldset>

            <fieldset className="form-block">
              <legend>{t('projectDetails') || 'Project Details'}</legend>
            <div className="form-group">
              <label>{t('designType') || 'Design Type'}</label>
              <select
                name="designType"
                value={formData.designType}
                onChange={handleInputChange}
              >
                <option value="">{t('selectDesignType') || 'Select design type'}</option>
                <option value="Full Body Wrap">{t('fullBodyWrap') || 'Full Body Wrap'}</option>
                <option value="Racing Stripes">{t('racingStripes') || 'Racing Stripes'}</option>
                <option value="Custom Logos">{t('customLogos') || 'Custom Logos'}</option>
                <option value="Number Plates">{t('numberPlates') || 'Number Plates'}</option>
                <option value="Decals & Stickers">{t('decalsStickers') || 'Decals & Stickers'}</option>
                <option value="Other">{t('other') || 'Other'}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('designDescription') || 'Design Description'}</label>
              <textarea
                name="designDescription"
                value={formData.designDescription}
                onChange={handleInputChange}
                rows="5"
                placeholder={t('designDescriptionPlaceholder') || 'Describe your design ideas, colors, style preferences...'}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('budgetRange') || 'Budget Range'}</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="">{t('selectBudget') || 'Select budget'}</option>
                  <option value="Under €200">{t('under200') || 'Under €200'}</option>
                  <option value="€200 - €500">{t('budget200500') || '€200 - €500'}</option>
                  <option value="€500 - €1,000">{t('budget5001000') || '€500 - €1,000'}</option>
                  <option value="Over €1,000">{t('over1000') || 'Over €1,000'}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('timeline') || 'Timeline'}</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  <option value="">{t('selectTimeline') || 'Select timeline'}</option>
                  <option value="ASAP">{t('asap') || 'ASAP'}</option>
                  <option value="1-2 weeks">{t('weeks12') || '1-2 weeks'}</option>
                  <option value="1 month">{t('month1') || '1 month'}</option>
                  <option value="Flexible">{t('flexible') || 'Flexible'}</option>
                </select>
              </div>
            </div>
            </fieldset>

            {submitStatus === 'success' && (
              <p className="graphics-form-status success">{t('thankYouMessage') || 'Thank you! We will contact you soon to discuss your motorcycle graphics project.'}</p>
            )}
            {submitStatus === 'error' && (
              <p className="graphics-form-status error">{t('requestError') || 'Failed to send request. Please try again.'}</p>
            )}

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? (t('submitting') || 'Sending...') : (t('submitRequest') || 'Submit Request')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Graphics;
