import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Login.css';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetCode, setResetCode] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(email.trim());
      setSent(true);
      if (res && res.resetCode) {
        setResetCode(res.resetCode);
      }
    } catch (err) {
      setError(err.message || (t('errorOccurred') || 'An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToReset = () => {
    navigate('/reset-password', { state: { resetCode } });
  };

  if (sent) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h1>{t('checkYourEmail') || 'Check your email'}</h1>
            <p className="login-subtitle">
              {resetCode
                ? (t('recoveryCodeBelow') || 'Your recovery code is in the simulated notification below.')
                : (t('resetEmailSent') || "If an account exists for that email, we've sent instructions to reset your password.")}
            </p>

            {/* Simulated email notification */}
            <div className="simulated-email">
              <div className="simulated-email-header">
                <span className="simulated-email-icon">✉</span>
                <span className="simulated-email-title">
                  {t('passwordResetEmail') || 'Password reset'}
                </span>
              </div>
              <div className="simulated-email-from">
                <strong>{t('from') || 'From'}:</strong> noreply@ridersforge.com
              </div>
              <div className="simulated-email-subject">
                <strong>{t('subject') || 'Subject'}:</strong>{' '}
                {t('yourRecoveryCode') || 'Your password recovery code'}
              </div>
              <div className="simulated-email-body">
                {resetCode ? (
                  <>
                    <p>{t('recoveryCodeMessage') || 'Use this code to reset your password:'}</p>
                    <p className="recovery-code-value">{resetCode}</p>
                    <p className="recovery-code-hint">
                      {t('recoveryCodeHint') || 'Enter this code on the next screen along with your new password.'}
                    </p>
                    <button
                      type="button"
                      className="submit-btn"
                      onClick={handleContinueToReset}
                      style={{ marginTop: 16 }}
                    >
                      {t('continueToResetPassword') || 'Continue to reset password'}
                    </button>
                  </>
                ) : (
                  <p className="simulated-email-no-message">
                    {t('noMessageForEmail') || 'No password reset request found for this email address.'}
                  </p>
                )}
              </div>
            </div>

            <p className="login-subtitle" style={{ marginTop: 24 }}>
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
            {t('forgotPasswordSubtitle') || "Enter your email and we'll show you a recovery code in a simulated email notification."}
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
              {loading ? (t('processing') || 'Processing...') : (t('sendRecoveryCode') || 'Send recovery code')}
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
