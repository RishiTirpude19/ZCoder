import React, { useEffect, useState } from "react";
import "./Messages.css";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = `https://z-coder.vercel.app`;
let socket;
let selectedChatCompare;

function Messages() {
  const loggedUserId = localStorage.getItem("userId");
  const [socketConnected, setSocketConnected] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [intialChats, setIntialChats] = useState([]);
  const [refreshChats, setRefreshChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`https://z-coder.vercel.app/chat`, { withCredentials: true });
        setIntialChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
    selectedChatCompare = selectedChat;
  }, [refreshChats, selectedChat]);

  // Socket connection setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket = io(ENDPOINT, {
      auth: { token },
    });

    socket.emit("setup", { _id: loggedUserId });

    socket.on("connected", () => {
      console.log("Socket connected");
      setSelectedChat(selectedChatCompare);
    });

    socket.on("connection", () => {
      setSocketConnected(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const receiveMessageHandler = (message) => {
      if (!selectedChatCompare || selectedChatCompare._id !== message.chat._id) {
        // Optionally handle unread messages here
      } else {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive message", (newMessage) => {
      if (selectedChat?._id === newMessage.chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receive message", receiveMessageHandler);
    };
  }, [selectedChat]);

  // Send message
  const sendMessage = async (chatId) => {
    try {
      const response = await axios.post(`https://z-coder.vercel.app/message`, { chatId, content: message }, { withCredentials: true });
      console.log(response.data);
      setMessages((prev) => [...prev, response.data.newMessage]);
      socket.emit("send message", response.data);
      handleMessages(chatId);
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  // Handle chat selection
  const handleMessages = async (chatId) => {
    setLoading(true);
    try {
      setSelectedChat(chatId);
      const response = await axios.get(`https://z-coder.vercel.app/message/${chatId}`, { withCredentials: true });
      setMessages(response.data.messages);

      const chat = intialChats.find(c => c._id === chatId);
      const otherUser = chat.users.find(user => user._id !== loggedUserId);
      setChatPartner(otherUser);
      setLoading(false);
      socket.emit("join chat", chatId);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  // Handle chat creation
  const handleChat = async (userId) => {
    try {
      const response = await axios.post(`https://z-coder.vercel.app/chat`, { userId }, { withCredentials: true });
      setRefreshChats((prev) => !prev);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle search functionality
  const handleSubmit = async () => {
    if (!search.trim()) {
      alert("Please enter a search query.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://z-coder.vercel.app/searchuser?query=${search}`, { withCredentials: true });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  const handleChatSelection = (chatId) => {
    setMessage('');
    handleMessages(chatId);
  };

  return (
    <div className="container">
      <div className="chats">
        <input
          type="text"
          placeholder="Search User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          Search
        </button>
        <hr />
        {results.length > 0 ? (
          <ul className="results-list">
            {results.map((user) => (
              <li key={user._id} onClick={() => handleChat(user._id)}>
                {user.username}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="chats">
        <h2>Chats</h2>
        <hr />
        {intialChats.length > 0 ? (
          <ul className="results-list">
            {intialChats.map((chat) => {
              const otherUser = chat.users.find((user) => user._id !== loggedUserId);
              return (
                <li key={chat._id} onClick={() => handleChatSelection(chat._id)}>
                  {otherUser?.username || "Unknown User"}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No chats available.</p>
        )}
      </div>
      <div className="chat-box">
        {!selectedChat ? (
          <p>Select a chat to start messaging</p>
        ) : (
          <div className="inside-chat-box">
            <div className="chat-header">
              <h3>{chatPartner ? chatPartner.username : "Loading..."}</h3>
            </div>
            <hr />
            <div className="display-messages">
              {messages.length > 0 ? (
                messages.map((mess) => (
                  <div
                    key={mess._id}
                    className={mess.sender === loggedUserId ? "sent-message" : "received-message"}
                  >
                    {mess.content}
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
            <div className="input-message-box">
              <input
                type="text"
                placeholder="Type your Message here ..."
                className="message-box-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="message-send-button" onClick={() => sendMessage(selectedChat)}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
