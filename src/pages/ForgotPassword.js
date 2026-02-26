import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Login.css';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || (t('errorOccurred') || 'An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h1>{t('checkYourEmail') || 'Check your email'}</h1>
            <p className="login-subtitle">
              {t('resetEmailSent') || "If an account exists for that email, we've sent instructions to reset your password."}
            </p>
            <p className="login-subtitle">
              <Link to="/login" className="forgot-password">
                {t('backToLogin') || 'Back to login'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>{t('forgotPassword') || 'Forgot password'}</h1>
          <p className="login-subtitle">
            {t('forgotPasswordSubtitle') || 'Enter your email and we\'ll send you a link to reset your password.'}
          </p>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{t('email') || 'Email'} *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('emailPlaceholder') || 'your@email.com'}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (t('processing') || 'Processing...') : (t('sendResetLink') || 'Send reset link')}
            </button>
          </form>

          <p className="switch-mode">
            <Link to="/login" className="switch-btn">
              {t('backToLogin') || 'Back to login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
