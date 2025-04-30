import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import logo from "../../assets/images/logonew.png"

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const chatListRef = useRef(null);
  const API_KEY = "AIzaSyC8jMVvbcn0FaW6p3_OCIkxHx616psXfYs";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset copied state after timeout
  useEffect(() => {
    if (copiedMessageId !== null) {
      const timer = setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedMessageId]);

  const generateApiResponse = async (userMessage) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: userMessage
            }]
          }],
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ],
          
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from API");
      }
      
      const apiResponse = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, {
        type: 'incoming',
        text: apiResponse
      }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, {
        type: 'incoming',
        text: `Error: ${error.message || "Something went wrong. Please try again."}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      type: 'outgoing',
      text: userInput
    }]);
    
    // Generate response
    generateApiResponse(userInput);
    
    // Clear input
    setUserInput('');
  };

  const copyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(index);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 mt-28 via-white to-blue-50">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-600 to-white-500 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 shadow-md">
              <span className="text-indigo-600 text-xl font-bold">AI</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">E-Mall Assistant</h1>
              <p className="text-xs text-indigo-200">Powered by Gemini</p>
            </div>
          </div>
          <img src={logo} alt="E-Mall Logo" className="w-20" />
        </div>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatListRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-md">
              <i className="fas fa-robot text-indigo-500 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-indigo-800">How can I help you today?</h2>
            <p className="max-w-md text-gray-600">Ask me about products, shopping advice, or anything else you need assistance with!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
              <button 
                onClick={() => setUserInput("What are the best deals today?")}
                className="bg-white hover:bg-indigo-50 text-indigo-700 font-medium py-3 px-4 rounded-xl shadow-sm border border-indigo-100 transition-all duration-300"
              >
                What are the best deals today?
              </button>
              <button 
                onClick={() => setUserInput("Help me find a gift for my friend")}
                className="bg-white hover:bg-indigo-50 text-indigo-700 font-medium py-3 px-4 rounded-xl shadow-sm border border-indigo-100 transition-all duration-300"
              >
                Help me find a gift
              </button>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.type === 'outgoing' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${
                message.type === 'outgoing' ? 'bg-indigo-500' : 'bg-white border border-indigo-100'
              }`}>
                {message.type === 'outgoing' ? (
                  <i className="fas fa-user text-white"></i>
                ) : (
                  <img src={logo} alt="E-Mall Logo" className="w-12 h-12 object-contain" />
                )}
              </div>
              <div 
                className={`relative mx-3 px-5 py-4 rounded-2xl ${
                  message.type === 'outgoing' 
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md' 
                    : 'bg-white text-gray-800 shadow-md border border-gray-100'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.type === 'incoming' && (
                  <button 
                    onClick={() => copyMessage(message.text, index)}
                    className="absolute bottom-2 right-2 text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 opacity-80 hover:opacity-100 transition-all duration-300 group"
                    title="Copy to clipboard"
                  >
                    {copiedMessageId === index ? (
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 text-sm mr-1"></i>
                        <span className="text-xs text-green-500 font-medium">Copied!</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <i className="fas fa-copy text-sm"></i>
                        <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Copy to clipboard</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] flex-row">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-indigo-100">
                <span className="text-indigo-600 font-bold">AI</span>
              </div>
              <div className="mx-3 px-6 py-4 rounded-2xl bg-white shadow-md border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-xl py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className={`bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3.5 px-6 rounded-xl shadow-md ${
              isLoading || !userInput.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-600 transition-all duration-300'
            }`}
          >
            <i className="fas fa-paper-plane mr-1"></i>
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
