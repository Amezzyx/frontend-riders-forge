import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './FAQ.css';

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: t('faq1Question') || 'Where does Grenzgaenger ship to?',
      answer: t('faq1Answer') || 'From Karlsruhe to Milan, from Tokyo to Miami in the USA - Grenzgaenger equipment is carried worldwide by our community. In the last 10 years, we have sent parcels to over 80 countries! For us, Connecting Riders Worldwide also means: Worldwide shipping! We deliver to almost every country, even to the most remote places. So you are always well equipped, no matter where you are.'
    },
    {
      question: t('faq2Question') || 'How can I contact you if I have a request or a question?',
      answer: t('faq2Answer') || 'For inquiries by email, you can reach our customer support team at support@grenzgaenger-shop.com. You can also reach us from Monday - Friday (except on public holidays) from 09:00 - 16:00 by phone or on WhatsApp at +49 721 451951 05. Please note that we cannot take calls on WhatsApp.'
    },
    {
      question: t('faq3Question') || 'Is there also a Grenzgaenger store?',
      answer: t('faq3Answer') || 'We do not currently have a store or warehouse outlet. However, we are always planning special pop-up store events where you can discover our products live on site, try them on and take them home with you. You can find out when and where the next events are taking place via our newsletter and on our social media channels.'
    },
    {
      question: t('faq4Question') || 'What is your return policy?',
      answer: t('faq4Answer') || 'You can return items within 30 days of purchase for a full refund, provided they are in their original condition with tags attached. Items must be unworn and unwashed. Please contact us at support@grenzgaenger-shop.com to initiate a return.'
    },
    {
      question: t('faq5Question') || 'How long does shipping take?',
      answer: t('faq5Answer') || 'Standard shipping typically takes 3-7 business days within Europe, and 7-14 business days for international orders. Express shipping options are available at checkout for faster delivery. Free shipping is available on orders over €50.'
    },
    {
      question: t('faq6Question') || 'What payment methods do you accept?',
      answer: t('faq6Answer') || 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway.'
    },
    {
      question: t('faq7Question') || 'Can I track my order?',
      answer: t('faq7Answer') || 'Yes! Once your order has been shipped, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.'
    },
    {
      question: t('faq8Question') || 'Do you offer gift cards?',
      answer: t('faq8Answer') || 'Currently, we do not offer physical or digital gift cards. However, you can purchase items as gifts and we can include a personalized message with your order. Please add gift message details at checkout.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1>{t('frequentlyAskedQuestions') || 'Frequently Asked Questions'}</h1>
          <p>{t('faqSubtitle') || 'Find answers to common questions about our products, shipping, returns, and more.'}</p>
        </div>

        <div className="faq-section">
          <h2>{t('questionsAboutStore') || 'Questions about the store'}</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className={openIndex === index ? 'rotated' : ''}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-contact">
          <h3>{t('stillHaveQuestions') || 'Still have questions?'}</h3>
          <p>{t('cantFindAnswer') || 'Can\'t find the answer you\'re looking for? Please feel free to contact us.'}</p>
          <a href="/contact" className="contact-btn">{t('contactUsBtn') || 'Contact Us'}</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

