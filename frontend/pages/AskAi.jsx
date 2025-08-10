import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa";

function AskAi() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setTyping(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/askai`, {
        content: message,
      });

      simulateTyping(res.data.message);
    } catch (error) {
      simulateTyping("⚠️ Error: Unable to reach AI.");
      console.error("Error fetching AI response:", error);
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
    <div className="h-[91.5vh] bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] px-6 py-12 flex justify-center">
      <div className="w-full max-w-4xl bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-white flex flex-col">
        <h1 className="text-3xl font-semibold mb-6 text-center select-none cursor-default">
          Chat with Groq AI
        </h1>

        {/* Chat History Box */}
        <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-4 mb-6 pr-2">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === "ai" ? "" : "justify-end"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="mt-1 text-violet-300">
                  <FaRobot size={20} />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap shadow-sm ${
                  msg.sender === "ai"
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-violet-600 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-lg bg-white/80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition duration-300 shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskAi;
