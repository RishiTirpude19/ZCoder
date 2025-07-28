import React, { useEffect, useState } from "react";

import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = `${import.meta.env.VITE_BACKEND_URL}`;
let socket;
let selectedChatCompare;

function Messages() {
  const loggedUserId = sessionStorage.getItem("userId");
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat`, { withCredentials: true });
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
    const token = sessionStorage.getItem("token");
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/message`, { chatId, content: message }, { withCredentials: true });
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/message/${chatId}`, { withCredentials: true });
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, { userId }, { withCredentials: true });
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchuser?query=${search}`, { withCredentials: true });
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
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-4 text-white font-sans ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar: Search + Chat List */}
        <div className="md:col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <input
              type="text"
              placeholder="Search User"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 rounded-md bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              Search
            </button>
  
            {results.length > 0 && (
              <ul className="mt-4 space-y-2">
                {results.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleChat(user._id)}
                    className="bg-white/30 p-2 rounded-md hover:bg-white/40 cursor-pointer"
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
  
          {/* Chat List */}
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Chats</h2>
            <hr className="border-white/30 mb-3" />
            <ul className="space-y-2">
              {intialChats.length > 0 ? (
                intialChats.map((chat) => {
                  const otherUser = chat.users.find((user) => user._id !== loggedUserId);
                  return (
                    <li
                      key={chat._id}
                      onClick={() => handleChatSelection(chat._id)}
                      className={`bg-white/30 p-2 rounded-md cursor-pointer hover:bg-white/40 ${
                        selectedChat === chat._id ? "ring-2 ring-violet-400" : ""
                      }`}
                    >
                      {otherUser?.username || "Unknown User"}
                    </li>
                  );
                })
              ) : (
                <p className="text-sm text-white/80">No chats available.</p>
              )}
            </ul>
          </div>
        </div>
  
        {/* Chat Box */}
        <div className="md:col-span-3">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl min-h-[500px] flex flex-col">
            {!selectedChat ? (
              <p className="text-center text-white/70 text-lg mt-20">Select a chat to start messaging</p>
            ) : (
              <>
                <div className="chat-header mb-4">
                  <h3 className="text-2xl font-semibold">{chatPartner ? chatPartner.username : "Loading..."}</h3>
                </div>
                <hr className="border-white/30 mb-4" />
  
                {/* Messages */}
                <div className="overflow-y-auto space-y-3 mb-4 pr-2 h-[400px] scrollbar-thin scrollbar-thumb-violet-500/80 scrollbar-track-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">

                  {messages.length > 0 ? (
                    messages.map((mess) => (
                      <div
  key={mess._id}
  className={`w-fit max-w-[60%] p-3 px-4 rounded-2xl text-sm break-words shadow-md ${
    mess.sender === loggedUserId
      ? "bg-gradient-to-r from-violet-600 to-indigo-600 ml-auto text-white"
      : "bg-white/80 text-black"
  }`}
>
  {mess.content}
</div>

                    ))
                  ) : (
                    <p className="text-white/70">No messages yet.</p>
                  )}
                </div>
  
                {/* Message Input */}
                <div className="flex gap-2 mt-auto">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 rounded-md bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                  <button
                    onClick={() => sendMessage(selectedChat)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Messages;
