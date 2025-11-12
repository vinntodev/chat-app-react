import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you?', sender: 'bot', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const botResponses = [
    "That's interesting! Tell me more... 🤔",
    "I see what you mean!",
    "That's a great point! 👍",
    "Hmm, let me think about that...",
    "Interesting perspective! 💡",
    "I understand. Anything else?",
    "That makes sense to me!",
    "Cool! What else is on your mind?",
  ];

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput('');

    setIsTyping(true);

    const typingDelay = Math.random() * 2000 + 1000;

    setTimeout(() => {
      setIsTyping(false);

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, typingDelay);
  };

  return (
    <>
      <div className="container">
        <div className="chat-box">
          <div className="header">
            <div className="header-content">
              <div className="avatar">🤖</div>
              <div>
                <h3 className="bot-name">ChatBot</h3>
                <p className="status">
                  {isTyping ? 'typing...' : 'Online'}
                </p>
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p className="empty-text">No messages yet</p>
                <p className="empty-subtext">Start a conversation!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message-wrapper ${msg.sender === 'user' ? 'user-align' : 'bot-align'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="small-avatar">🤖</div>
                  )}
                  <div className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    <p className="message-text">{msg.text}</p>
                    <span className="timestamp">{msg.time}</span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="small-avatar">👤</div>
                  )}
                </div>
              ))
            )}

            {isTyping && (
              <div className="message-wrapper bot-align">
                <div className="small-avatar">🤖</div>
                <div className="message bot-message typing-message">
                  <div className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot dot-delay-1"></span>
                    <span className="dot dot-delay-2"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type a message..."
              className="input"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              className={`button ${isTyping ? 'button-disabled' : ''}`}
              disabled={isTyping}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;