import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bot, Send, ArrowLeft, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AskAi() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { sender: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setTyping(true);
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/askai`, {
        content: message,
      });

      simulateTyping(res.data.message);
    } catch (error) {
      simulateTyping("⚠️ Error: Unable to reach AI. Please try again later.");
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const simulateTyping = (text) => {
    let index = 0;
    const interval = 20;
    let currentText = "";

    const typer = setInterval(() => {
      if (index < text.length) {
        currentText += text.charAt(index);
        index++;
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { sender: "ai", content: currentText },
        ]);
      } else {
        clearInterval(typer);
        setTyping(false);
      }
    }, interval);

    setChatHistory((prev) => [...prev, { sender: "ai", content: "" }]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Bot className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">AI Assistant</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Chat with Groq AI</span>
              </h1>
              <p className="text-slate-400">Get instant help with your coding questions</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          
          {/* Chat History Box */}
          <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-4 mb-6 pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Welcome to AI Chat</h3>
                <p className="text-slate-400">Ask me anything about coding, algorithms, or programming concepts!</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.sender === "ai" ? "" : "justify-end"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="mt-1 text-blue-400">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-lg ${
                      msg.sender === "ai"
                        ? "bg-slate-700/50 text-white border border-slate-600/50"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.content}
                    {msg.sender === "ai" && typing && (
                      <div className="flex items-center mt-2">
                        <div className="animate-pulse text-blue-400">●</div>
                        <div className="animate-pulse text-blue-400 delay-100">●</div>
                        <div className="animate-pulse text-blue-400 delay-200">●</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={1}
                placeholder="Ask me anything about coding..."
                disabled={loading}
                className="w-full p-4 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 transition-all border border-slate-600/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send
                </>
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
            <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Pro Tips
            </h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Ask specific questions for better answers</li>
              <li>• Include code snippets when asking for debugging help</li>
              <li>• Ask for explanations of algorithms or concepts</li>
              <li>• Request code examples and best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskAi;
