import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(Date.now().toString());
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: "Welcome! I am your Real Estate Concierge. I can guide you through finding your ideal property. May I have your name to begin?" 
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://real-estate-chatbot-api.vercel.app/api/chat',
        {
          message: userMsg.content,
          sessionId: sessionId
        }
      );

      const botMsg = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Confirm & Submit
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'https://real-estate-chatbot-api.vercel.app/api/extract-data',
        {
          sessionId: sessionId
        }
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Thank you! Your details have been submitted successfully!

Summary:
• Name: ${response.data.name || 'N/A'}
• Phone: ${response.data.phone || 'N/A'}
• Budget: ${response.data.budget || 'N/A'}
• Location: ${response.data.location || 'N/A'}
• Property Type: ${response.data.propertyType || 'N/A'}

Our team will contact you soon!`
      }]);

    } catch (error) {
      console.error("Submit Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "❌ Sorry, there was an error submitting your details. Please try again."
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-widget">
      {/* Toggle Button */}
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>Real Estate Concierge</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                {msg.content}

                {msg.role === 'assistant' &&
                  msg.content.includes("<<<COMPLETE>>>") &&
                  index === messages.length - 1 && (
                    <button
                      className="confirm-btn"
                      onClick={handleConfirmSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                    </button>
                  )}
              </div>
            ))}

            {isLoading && (
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
