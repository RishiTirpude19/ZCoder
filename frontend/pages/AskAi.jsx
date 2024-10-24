import React, { useState } from "react";
import axios from "axios";
import "./AskAi.css"
function AskAi() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post("http://localhost:8080/askai", { content: message });
        console.log(res.data);
        setResponse(res.data.message);
    } catch (error) {
        console.error("Error fetching response from Groq API", error);
    }
    };


    return (
    <div className="chat-container">
      <h1>Chat with Groq AI</h1>
      <form onSubmit={handleSubmit}>
        <textarea className="chat-container-textarea"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
        <button type="submit">Send</button>
      </form>
      {response && (
        <div className="response-container">
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AskAi
