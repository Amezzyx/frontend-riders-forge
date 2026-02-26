import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const successMessage = location.state?.message;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          // Redirect admin users to admin dashboard, regular users to account
          if (result.user?.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/account');
          }
        }
      } else {
        if (!formData.firstName || !formData.lastName) {
          setError(t('pleaseProvideName') || 'Please provide first and last name');
          setLoading(false);
          return;
        }
        const result = await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        if (result.success) {
          navigate('/account');
        }
      }
    } catch (err) {
      // Show user-friendly error messages with translations
      let errorMessage = t('errorOccurred') || 'An error occurred. Please try again.';
      
      if (err.message) {
        if (err.message.includes('already exists') || err.message.includes('User with this email') || err.message.includes('has been signed in')) {
          errorMessage = t('emailAlreadySignedIn') || 'This email has been signed in. Please use a different email or try logging in.';
        } else if (err.message.includes('Invalid email or password')) {
          errorMessage = t('invalidCredentials') || 'Invalid email or password. Please check your credentials and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>{isLogin ? (t('login') || 'Login') : (t('createAccount') || 'Create Account')}</h1>
          <p className="login-subtitle">
            {isLogin 
              ? (t('welcomeBack') || 'Welcome back! Please login to your account.')
              : (t('createAccountSubtitle') || 'Create an account to track orders and save your preferences.')
            }
          </p>

          {successMessage && (
            <div className="error-message" style={{ color: 'green', marginBottom: '15px', textAlign: 'center', background: '#efe' }}>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('firstName') || 'First Name'} *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder={t('firstNamePlaceholder') || 'John'}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('lastName') || 'Last Name'} *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder={t('lastNamePlaceholder') || 'Doe'}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>{t('email') || 'Email'} *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={t('emailPlaceholder') || 'your@email.com'}
              />
            </div>

            <div className="form-group">
              <label>{t('password') || 'Password'} *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (t('processing') || 'Processing...') : (isLogin ? (t('login') || 'Login') : (t('createAccount') || 'Create Account'))}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="social-login-btn google">
            Continue with Google
          </button>
          <button className="social-login-btn facebook">
            Continue with Facebook
          </button>

          <p className="switch-mode">
            {isLogin ? (t('noAccount') || "Don't have an account? ") : (t('haveAccount') || 'Already have an account? ')}
            <button 
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? (t('signUp') || 'Sign Up') : (t('login') || 'Login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

