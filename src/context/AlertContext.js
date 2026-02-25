import React, { createContext, useContext, useState, useCallback } from 'react';
import './AlertContext.css';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ open: false, message: '', type: 'info' });

  const showAlert = useCallback((message, type = 'info') => {
    setAlert({ open: true, message, type });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      {alert.open && (
        <div className="alert-backdrop" onClick={closeAlert} role="presentation">
          <div
            className={`alert-modal alert-${alert.type}`}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-message"
          >
            <div className="alert-icon">
              {alert.type === 'error' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              )}
            </div>
            <p id="alert-message" className="alert-message">{alert.message}</p>
            <button type="button" className="alert-btn" onClick={closeAlert} autoFocus>
              OK
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
