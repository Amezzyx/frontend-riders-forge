import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError(t('passwordsDoNotMatch') || 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError(t('passwordMinLength') || 'Password must be at least 6 characters.');
      return;
    }
    if (!token) {
      setError(t('invalidResetLink') || 'Invalid reset link. Please use the link from your email.');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, newPassword);
      navigate('/login', { state: { message: t('passwordUpdated') || 'Password updated. You can log in now.' } });
    } catch (err) {
      setError(err.message || (t('errorOccurred') || 'An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h1>{t('invalidResetLink') || 'Invalid reset link'}</h1>
            <p className="login-subtitle">
              {t('invalidResetLinkSubtitle') || 'This link is missing or invalid. Please request a new password reset from the login page.'}
            </p>
            <Link to="/forgot-password" className="forgot-password">
              {t('requestNewLink') || 'Request new link'}
            </Link>
            <p className="switch-mode" style={{ marginTop: 20 }}>
              <Link to="/login" className="switch-btn">
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
          <h1>{t('resetPassword') || 'Reset password'}</h1>
          <p className="login-subtitle">
            {t('resetPasswordSubtitle') || 'Enter your new password below.'}
          </p>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{t('newPassword') || 'New password'} *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>{t('confirmPassword') || 'Confirm password'} *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (t('processing') || 'Processing...') : (t('resetPassword') || 'Reset password')}
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

export default ResetPassword;
