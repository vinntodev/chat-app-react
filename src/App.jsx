import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedTheme = localStorage.getItem('chatTheme');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          id: 1,
          text: 'Hello! How can I help you today? Type /help for commands.',
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reactions: []
        }
      ]);
    }

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatTheme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getSmartResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! Nice to meet you! How can I assist you today? 👋";
    }
    if (input.includes('name')) {
      return "I'm ChatBot, your friendly AI assistant! What's your name? 🤖";
    }
    if (input.includes('weather')) {
      return "I don't have real-time weather data, but you can check weather.com for accurate forecasts! ☀️";
    }
    if (input.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}. ⏰`;
    }
    if (input.includes('date')) {
      return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`;
    }
    if (input.includes('how are you')) {
      return "I'm doing great! Thanks for asking! How about you? 😊";
    }
    if (input.includes('thank')) {
      return "You're welcome! Happy to help! 🎉";
    }
    if (input.includes('bye') || input.includes('goodbye')) {
      return "Goodbye! Have a great day! See you soon! 👋";
    }
    if (input.includes('help')) {
      return "I'm here to chat! You can also use commands like /help, /clear, /theme. Try them out! 💡";
    }

    const defaultResponses = [
      "That's interesting! Tell me more... 🤔",
      "I see what you mean!",
      "That's a great point! 👍",
      "Hmm, let me think about that...",
      "Interesting perspective! 💡",
      "I understand. Anything else?",
      "That makes sense to me!",
      "Cool! What else is on your mind?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😊', '😢', '😭', '😡', '👍', '👎', '❤️', '🔥', '✨', '🎉', '💯', '🙌'];
  const reactionEmojis = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

  const themes = {
    purple: { name: 'Purple', icon: '💜' },
    blue: { name: 'Ocean Blue', icon: '🌊' },
    green: { name: 'Forest Green', icon: '🌲' },
    pink: { name: 'Sweet Pink', icon: '🌸' },
    orange: { name: 'Sunset Orange', icon: '🌅' },
    red: { name: 'Ruby Red', icon: '💎' }
  };

  const handleCommand = (command) => {
    switch (command) {
      case '/help':
        return {
          text: `📚 Available Commands:\n\n/help - Show this help menu\n/clear - Clear chat history\n/theme - Change color theme\n\n💡 Tips:\n- Use emoji picker 😊\n- React to messages\n- Toggle dark mode 🌙\n- Upload images 🖼️`,
          sender: 'bot'
        };
      case '/clear':
        setMessages([]);
        localStorage.removeItem('chatHistory');
        return {
          text: "Chat history cleared! Starting fresh! 🗑️",
          sender: 'bot'
        };
      case '/theme':
        setShowThemeMenu(true);
        return {
          text: "Theme menu opened! Choose your favorite color theme above. 🎨",
          sender: 'bot'
        };
      default:
        return null;
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    if (input.startsWith('/')) {
      const commandResponse = handleCommand(input.toLowerCase());
      if (commandResponse) {
        const botMessage = {
          id: Date.now(),
          text: commandResponse.text,
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reactions: []
        };
        setMessages(prev => [...prev, botMessage]);
        setInput('');
        return;
      }
    }

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages(prev => [...prev, userMessage]);
    const userInputText = input;
    setInput('');
    setShowEmojiPicker(false);

    setIsTyping(true);

    const typingDelay = Math.random() * 2000 + 1000;

    setTimeout(() => {
      setIsTyping(false);

      const smartResponse = getSmartResponse(userInputText);

      const botMessage = {
        id: Date.now() + 1,
        text: smartResponse,
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageMessage = {
          id: Date.now(),
          text: '📷 Image uploaded',
          sender: 'user',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reactions: [],
          image: event.target.result
        };
        setMessages(prev => [...prev, imageMessage]);

        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: "Nice image! I can see you've uploaded a photo. 📸",
            sender: 'bot',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            reactions: []
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={`container ${darkMode ? 'dark-mode' : ''} theme-${currentTheme}`}>
        <div className="chat-box">
          <div className="header">
            <div className="header-content">
              <div className="avatar">🤖</div>
              <div>
                <h3 className="bot-name">ChatBot AI</h3>
                <p className="status">
                  {isTyping ? 'typing...' : 'Online'}
                </p>
              </div>
            </div>
            
            <div className="header-controls">
              <button 
                className="control-button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change Theme"
              >
                🎨
              </button>
              <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                <div className="toggle-thumb">
                  {darkMode ? '🌙' : '☀️'}
                </div>
              </div>
            </div>

            {showThemeMenu && (
              <div className="theme-menu">
                <p className="theme-menu-title">Choose Theme:</p>
                <div className="theme-options">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentTheme(key);
                        setShowThemeMenu(false);
                      }}
                    >
                      <span className="theme-icon">{theme.icon}</span>
                      <span className="theme-name">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="uploaded" 
                          className="message-image"
                          onClick={() => setShowImagePreview(msg.image)}
                        />
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
            <button 
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Image"
            >
              📎
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message or /help..."
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

        {showImagePreview && (
          <div className="image-preview-modal" onClick={() => setShowImagePreview(null)}>
            <div className="image-preview-content">
              <button className="close-preview" onClick={() => setShowImagePreview(null)}>✕</button>
              <img src={showImagePreview} alt="preview" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;