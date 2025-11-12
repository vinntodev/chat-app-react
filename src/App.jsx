import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😊', '😢', '😭', '😡', '👍', '👎', '❤️', '🔥', '✨', '🎉', '💯', '🙌'];
  const reactionEmojis = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowEmojiPicker(false);

    setIsTyping(true);

    const typingDelay = Math.random() * 2000 + 1000;

    setTimeout(() => {
      setIsTyping(false);

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };

      setMessages(prev => [...prev, botMessage]);
    }, typingDelay);
  };

  const addEmoji = (emoji) => {
    setInput(input + emoji);
  };

  const addReaction = (messageId, emoji) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
    setShowReactionPicker(null);
  };

  return (
    <>
      <div className={darkMode ? 'container dark-mode' : 'container'}>
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
            <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
              <div className="toggle-thumb">
                {darkMode ? '🌙' : '☀️'}
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message-wrapper ${msg.sender === 'user' ? 'user-align' : 'bot-align'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="small-avatar">🤖</div>
                )}
                <div className="message-container">
                  <div className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    <button
                      className="reaction-button"
                      onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                    >
                      😊
                    </button>
                    {showReactionPicker === msg.id && (
                      <div className="reaction-picker">
                        {reactionEmojis.map((emoji, idx) => (
                          <span key={idx} onClick={() => addReaction(msg.id, emoji)}>
                            {emoji}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="message-text">{msg.text}</p>
                    <span className="timestamp">{msg.time}</span>
                  </div>
                  {msg.reactions.length > 0 && (
                    <div className="reactions-display">
                      {msg.reactions.map((reaction, idx) => (
                        <div key={idx} className="reaction-item">
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="small-avatar">👤</div>
                )}
              </div>
            ))}

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
            <div className="input-wrapper">
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
                className="emoji-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {emojis.map((emoji, idx) => (
                    <span key={idx} onClick={() => addEmoji(emoji)}>
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
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