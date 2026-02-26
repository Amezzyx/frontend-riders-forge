import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Chatbot.css';

const ChatbotButton = ({ onClick, hasUnread }) => {
  const { t } = useLanguage();
  return (
    <button
      className={`chatbot-button ${hasUnread ? 'has-unread' : ''}`}
      onClick={onClick}
      aria-label={t('chatbotButtonTitle')}
      title={t('chatbotButtonTitle')}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  );
};

export default ChatbotButton;







