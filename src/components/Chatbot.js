import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '',
      isWelcome: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const getBotResponse = (userMessage, tFn) => {
    const msg = userMessage.toLowerCase().trim();
    const normalized = msg
      .replace(/[čć]/g, 'c').replace(/[ď]/g, 'd').replace(/[ěé]/g, 'e')
      .replace(/[ň]/g, 'n').replace(/[ř]/g, 'r').replace(/[š]/g, 's')
      .replace(/[ť]/g, 't').replace(/[ůú]/g, 'u').replace(/[ý]/g, 'y')
      .replace(/[ž]/g, 'z').replace(/[í]/g, 'i').replace(/[áàä]/g, 'a').replace(/[ó]/g, 'o');

    if (msg.match(/^(\?|help|commands|prikazy|príkazy|príkaz|čo vieš|čo viete|co vies|what can you do|topics|témy|temy|zoznam|list)$/) ||
        normalized.match(/^(help|prikazy|prikaz|co vies|what can you|topics|zoznam|list)$/)) {
      return tFn('chatbotCommandsList');
    }

    if (msg.match(/^(hi|hello|hey|greetings|ahoj|čau|cau|dobrý|dobry|zdravím|zdravim|dobre (ranny|den|vecer))/) ||
        normalized.match(/^(hi|hello|hey|ahoj|cau|dobry|zdravim)/)) {
      return tFn('chatbotGreetingReply');
    }

    if (msg.match(/(shipping|delivery|how long|when will|arrive|doprava|doručenie|dodanie|kedy príde|kedy pride|posielate|dodávate|dodavate|preprava|zásielka|zasielka)/) ||
        normalized.match(/(doprava|dorucenie|dodanie|kedy pride|posielate|dodavate|preprava|zasielka)/)) {
      return tFn('chatbotShipping');
    }

    if (msg.match(/(return|refund|exchange|send back|vrátenie|reklamácia|vymeniť|vymenit|reklamovat|reklamacia)/) ||
        normalized.match(/(vrátenie|vratenie|reklamacia|reklamacia|vymenit)/)) {
      return tFn('chatbotReturns');
    }

    if (msg.match(/(payment|pay|card|credit|debit|paypal|bank transfer|platba|platobné|platobne|karta|platit|uhradiť|uhradit)/) ||
        normalized.match(/(platba|platobne|karta|platit|uhradit)/)) {
      return tFn('chatbotPayment');
    }

    if (msg.match(/(product|item|size|available|stock|in stock|produkt|tovar|veľkosť|velkost|sklad|dostupn|máte|mate|na sklade)/) ||
        normalized.match(/(produkt|tovar|velkost|sklad|dostupn|mate|na sklade)/)) {
      return tFn('chatbotProducts');
    }

    if (msg.match(/(order|track|tracking|status|where is my order|objednávka|objednavka|sledovať|sledovat|stav (objednávky|objednavky)|kde je)/) ||
        normalized.match(/(objednavka|objednávka|sledovat|sledovanie|kde je moja)/)) {
      return tFn('chatbotOrderTracking');
    }

    if (msg.match(/(size|sizing|fit|measurement|small|large|medium|veľkosť|velkost|meranie|sedí|sedi|tabuľka veľkostí|size guide)/) ||
        normalized.match(/(velkost|meranie|sedi|tabuľka|velkosti)/)) {
      return tFn('chatbotSizing');
    }

    if (msg.match(/(contact|phone|email|support|customer service|kontakt|telefón|telefon|email|podpora|napísať|napisat|volať|volat)/) ||
        normalized.match(/(kontakt|telefon|podpora|napisat|volat)/)) {
      return tFn('chatbotContact');
    }

    if (msg.match(/(navigate|find|where|menu|categories|nájsť|najst|kde|ponuka|kategóri|kategorie|hlavná stránka|homepage)/) ||
        normalized.match(/(najst|kde|ponuka|kategorie|hlavna stranka)/)) {
      return tFn('chatbotNavigate');
    }

    if (msg.match(/(account|login|sign up|register|profile|účet|ucet|prihlásenie|prihlasenie|registrovať|registrovat|registrácia)/) ||
        normalized.match(/(ucet|prihlasenie|registrovat|registracia)/)) {
      return tFn('chatbotAccount');
    }

    if (msg.match(/(assist|problem|issue|question|pomoc|problém|problem|otázka|otazka|potrebujem|neviem)/) ||
        normalized.match(/(problem|otazka|potrebujem|neviem)/)) {
      return tFn('chatbotHelp');
    }

    const defaultMsg = tFn('chatbotDefaultReply');
    return defaultMsg.replace('{message}', userMessage);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    const newUserMessage = {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage, t);
      const newBotMessage = {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="chatbot-overlay" onClick={onClose}></div>
      <div className="chatbot-window">
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3>{t('chatbotTitle')}</h3>
              <span className="chatbot-status">{t('chatbotOnline')}</span>
            </div>
          </div>
          <button className="chatbot-close-btn" onClick={onClose} aria-label={t('chatbotCloseLabel')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chatbot-message ${message.type}`}>
              {message.type === 'bot' && (
                <div className="chatbot-message-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              )}
              <div className="chatbot-message-content">
                <p>{message.isWelcome ? t('chatbotWelcome') : message.text}</p>
                <span className="chatbot-message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chatbot-message bot">
              <div className="chatbot-message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="chatbot-message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder={t('chatbotPlaceholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button type="submit" className="chatbot-send-btn" disabled={!inputValue.trim() || isTyping}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;



