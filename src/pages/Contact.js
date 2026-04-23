import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      await api.createContactRequest(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>{t('contactUs') || 'Contact Us'}</h1>
          <p>{t('contactSubtitle') || 'Have a question or need help? We\'re here for you!'}</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="info-section">
              <h2>{t('getInTouch') || 'Get in Touch'}</h2>
              <p>{t('contactSupportText') || 'Our customer support team is available to help you with any questions or concerns.'}</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <h3>{t('phoneWhatsapp') || 'Phone & WhatsApp'}</h3>
                  <p>+421 721 451 951</p>
                  <span className="hours">{t('contactHours') || 'Monday to Friday, 09:00 to 16:00'}</span>
                </div>

                <div className="contact-item">
                  <h3>{t('email') || 'Email'}</h3>
                  <p>support@ridersforge-shop.com</p>
                  <span className="hours">{t('respondWithin24') || 'We respond within 24 hours'}</span>
                </div>

                <div className="contact-item">
                  <h3>{t('address') || 'Address'}</h3>
                  <p>Ridersforge Shop<br />
                  Bratislava, Slovakia</p>
                </div>
              </div>
            </div>

            <div className="support-section">
              <h3>{t('support') || 'Support'}</h3>
              <ul>
                <li><a href="/faq">{t('faq') || 'FAQ'}</a></li>
                <li><a href="/shipping">{t('shippingDelivery') || 'Shipping & Delivery'}</a></li>
                <li><a href="/returns">{t('returns') || 'Returns'}</a></li>
                <li><a href="/payment">{t('payment') || 'Payment'}</a></li>
              </ul>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>{t('sendUsMessage') || 'Send us a Message'}</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('name') || 'Name'} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('email') || 'Email'} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('subject') || 'Subject'} *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('message') || 'Message'} *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <p className="contact-form-status success">
                  {t('messageSentSuccess') || 'Message sent successfully!'}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="contact-form-status error">
                  {t('messageSentError') || 'Something went wrong. Please try again or contact us by email.'}
                </p>
              )}
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? (t('sending') || 'Sending...') : (t('sendMessage') || 'Send Message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

