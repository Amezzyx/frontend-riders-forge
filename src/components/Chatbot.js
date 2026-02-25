import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your AI support assistant. How can I help you today?',
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

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    // Greetings
    if (message.match(/^(hi|hello|hey|greetings)/)) {
      return "Hello! I'm here to help you with any questions about Riders Forge. What would you like to know?";
    }

    // Shipping questions
    if (message.match(/(shipping|delivery|how long|when will|arrive)/)) {
      return "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over €50. Orders are typically processed within 1-2 business days.";
    }

    // Returns/Refunds
    if (message.match(/(return|refund|exchange|send back)/)) {
      return "We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging. You can initiate a return through your account or contact our support team at support@ridersforge.com.";
    }

    // Payment questions
    if (message.match(/(payment|pay|card|credit|debit|paypal|bank transfer)/)) {
      return "We accept credit/debit cards, PayPal, and bank transfers. All payments are processed securely. Your payment information is encrypted and never stored on our servers.";
    }

    // Product questions
    if (message.match(/(product|item|size|available|stock|in stock)/)) {
      return "You can browse our products by category (Men, Women, MX Gear, Accessories). Each product page shows available sizes and stock status. If you need help finding a specific item, let me know!";
    }

    // Order tracking
    if (message.match(/(order|track|tracking|status|where is my order)/)) {
      return "You can track your order status in your account dashboard. Once your order ships, you'll receive a tracking number via email. If you need help, contact support@ridersforge.com.";
    }

    // Size questions
    if (message.match(/(size|sizing|fit|measurement|small|large|medium)/)) {
      return "Size charts are available on each product page. If you're unsure about sizing, we recommend checking the size guide or contacting our support team for personalized assistance.";
    }

    // Contact information
    if (message.match(/(contact|phone|email|support|help|customer service)/)) {
      return "You can reach us at:\n• Phone: +421 912 123 456\n• Email: support@ridersforge.com\n• Hours: Mon-Fri 09:00 - 16:00\nYou can also visit our Contact page for more options.";
    }

    // Website navigation
    if (message.match(/(navigate|find|where|menu|categories)/)) {
      return "You can browse products by category in the main menu: Men, Women, MX Gear and Accessories or check out our featured products on the homepage.";
    }

    // Account questions
    if (message.match(/(account|login|sign up|register|profile)/)) {
      return "You can create an account by clicking 'Login' in the top right corner, then selecting 'Sign Up'. With an account, you can track orders, save addresses, and manage your preferences.";
    }

    // General help
    if (message.match(/(help|assist|support|problem|issue|question)/)) {
      return "I'm here to help! You can ask me about:\n• Shipping and delivery\n• Returns and refunds\n• Product information\n• Order tracking\n• Payment methods\n• Size guides\n• Or anything else about Riders Forge!";
    }

    // Default response
    return "I understand you're asking about: \"" + userMessage + "\". Let me help you with that. Could you provide more details? You can also contact our support team at support@ridersforge.com for immediate assistance.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    const newUserMessage = {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      const newBotMessage = {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400); // Random delay between 800-1200ms
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
              <h3>AI Support Assistant</h3>
              <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button className="chatbot-close-btn" onClick={onClose} aria-label="Close chatbot">
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
                <p>{message.text}</p>
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
            placeholder="Type your message..."
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



