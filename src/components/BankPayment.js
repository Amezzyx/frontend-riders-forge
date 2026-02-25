import React, { useState } from 'react';
import './BankPayment.css';

const BankPayment = ({ orderTotal, orderNumber, onConfirm }) => {
  const [copySuccess, setCopySuccess] = useState('');

  // Bank account details - Update these with your actual bank information
  const bankDetails = {
    accountHolder: 'Riders Forge s.r.o.',
    iban: 'SK12 3456 7890 1234 5678 9012',
    swift: 'TATRSKBX',
    bankName: 'Tatra Banka',
    amount: orderTotal,
    reference: orderNumber || 'ORDER-' + Date.now(),
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="bank-payment">
      <div className="bank-payment-header">
        <h2>Bank Transfer Payment</h2>
        <p>Please transfer the exact amount to complete your order</p>
      </div>

      <div className="bank-payment-content">
        <div className="payment-amount-box">
          <div className="amount-label">Amount to Pay</div>
          <div className="amount-value">€{orderTotal.toFixed(2)}</div>
        </div>

        <div className="bank-details-section">
          <h3>Bank Account Details</h3>
          <div className="bank-details-grid">
            <div className="bank-detail-item">
              <label>Account Holder</label>
              <div className="bank-detail-value">
                <span>{bankDetails.accountHolder}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(bankDetails.accountHolder, 'accountHolder')}
                  title="Copy"
                >
                  {copySuccess === 'accountHolder' ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <div className="bank-detail-item">
              <label>IBAN</label>
              <div className="bank-detail-value">
                <span className="iban-code">{bankDetails.iban}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(bankDetails.iban, 'iban')}
                  title="Copy"
                >
                  {copySuccess === 'iban' ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <div className="bank-detail-item">
              <label>SWIFT / BIC</label>
              <div className="bank-detail-value">
                <span>{bankDetails.swift}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(bankDetails.swift, 'swift')}
                  title="Copy"
                >
                  {copySuccess === 'swift' ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <div className="bank-detail-item">
              <label>Bank Name</label>
              <div className="bank-detail-value">
                <span>{bankDetails.bankName}</span>
              </div>
            </div>

            <div className="bank-detail-item full-width">
              <label>Payment Reference</label>
              <div className="bank-detail-value">
                <span className="reference-code">{bankDetails.reference}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(bankDetails.reference, 'reference')}
                  title="Copy"
                >
                  {copySuccess === 'reference' ? '✓' : '📋'}
                </button>
              </div>
              <p className="reference-note">
                ⚠️ Important: Please include this reference number in your transfer so we can match your payment to your order.
              </p>
            </div>
          </div>
        </div>

        <div className="payment-instructions">
          <h3>Payment Instructions</h3>
          <ol>
            <li>Transfer the exact amount of <strong>€{orderTotal.toFixed(2)}</strong> to the bank account above</li>
            <li>Include the payment reference <strong>{bankDetails.reference}</strong> in the transfer description</li>
            <li>Your order will be processed once we receive the payment (usually within 1-2 business days)</li>
            <li>You will receive an email confirmation when your payment is received</li>
          </ol>
        </div>

        <div className="payment-note">
          <p>
            <strong>Note:</strong> Bank transfers typically take 1-3 business days to process. 
            Your order will be held until payment is confirmed. If you have any questions, 
            please contact our support team.
          </p>
        </div>

        <div className="bank-payment-actions">
          <button className="confirm-payment-btn" onClick={onConfirm}>
            I've Completed the Transfer
          </button>
          <p className="action-note">
            Click this button after you've made the bank transfer to confirm your order
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankPayment;







