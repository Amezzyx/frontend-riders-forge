import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tokenFromUrl = searchParams.get('token') || '';
  const tokenFromState = location.state?.resetCode || '';
  const { t } = useLanguage();
  const [recoveryCode, setRecoveryCode] = useState(tokenFromState || tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = recoveryCode.trim();

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
      setError(t('recoveryCodeRequired') || 'Please enter the recovery code from the email.');
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>{t('resetPassword') || 'Reset password'}</h1>
          <p className="login-subtitle">
            {t('resetPasswordSubtitle') || 'Enter the recovery code and your new password below.'}
          </p>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{t('recoveryCode') || 'Recovery code'} *</label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                required
                placeholder={t('recoveryCodePlaceholder') || 'Paste the code from the email'}
                autoComplete="one-time-code"
              />
            </div>
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
            <Link to="/forgot-password" className="switch-btn">
              {t('requestNewCode') || 'Request new recovery code'}
            </Link>
            {' · '}
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
