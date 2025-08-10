import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {formatMessageTime} from "../utils/DateTime";
import {useSocket} from "../context/socketContext";
import "./Messages.css";


const Message = () => {
  const user = useSelector((state) => state.user.user);
  const { onlineUsers } = useSocket();
  const { socket } = useSocket();
  const bottomRef = useRef(null);
  const [usersList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      console.log("Received new message:", message);
      
      if (!selectedUser) return;
      
      // Check if this message is part of the current conversation
      const senderId = typeof message.sender === "object" ? message.sender._id : message.sender;
      const receiverId = typeof message.receiver === "object" ? message.receiver._id : message.receiver;
      
      const isRelevantMessage = 
        (senderId === selectedUser._id && receiverId === user._id) ||
        (senderId === user._id && receiverId === selectedUser._id);
      
      if (isRelevantMessage) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(m => m._id === message._id);
          if (!messageExists) {
            return [...prev, message];
          }
          return prev;
        });
      }
    };

    const handleMessageSent = (message) => {
      console.log("Message sent confirmation:", message);
      // This handles the sender's side - confirm message was sent
      if (selectedUser) {
        const senderId = typeof message.sender === "object" ? message.sender._id : message.sender;
        const receiverId = typeof message.receiver === "object" ? message.receiver._id : message.receiver;
        
        const isRelevantMessage = 
          (senderId === user._id && receiverId === selectedUser._id);
        
        if (isRelevantMessage) {
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(m => m._id === message._id);
            if (!messageExists) {
              // Remove any temporary messages and add the real one
              const filteredMessages = prev.filter(m => !m.isTemporary);
              return [...filteredMessages, message];
            }
            return prev;
          });
        }
      }
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageSent", handleMessageSent);
    };
  }, [socket, selectedUser, user._id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/messages/users`,
          { withCredentials: true }
        );
        setUserList(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleUserClick = async (clickedUser) => {
    setSelectedUser(clickedUser);
    setLoadingMessages(true);
    setMessages([]);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/messages/${clickedUser._id}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageContent = newMessage;
    const tempMessageId = Date.now();
    
    const tempMessage = {
      _id: tempMessageId,
      sender: user,
      receiver: selectedUser,
      content: messageContent,
      createdAt: new Date().toISOString(),
      isTemporary: true
    };
    
    // Add temporary message immediately for better UX
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/messages/send/${selectedUser._id}`,
        { content: messageContent },
        { withCredentials: true }
      );
      
      // Replace temporary message with real one
      setMessages((prev) => 
        prev.map(msg => 
          msg._id === tempMessageId ? response.data : msg
        )
      );
      
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove temporary message on error
      setMessages((prev) => prev.filter(msg => msg._id !== tempMessageId));
      // Optionally show error to user
      alert("Failed to send message. Please try again.");
    }
  };

  // Segregate users into online and offline
  const onlineUsersList = usersList.filter(u => onlineUsers.includes(u._id));
  const offlineUsersList = usersList.filter(u => !onlineUsers.includes(u._id));

  // Filter based on search query
  const filteredOnlineUsers = onlineUsersList.filter(u =>
    (u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOfflineUsers = offlineUsersList.filter(u =>
    (u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const UserCard = ({ user, isOnline }) => (
    <div
      onClick={() => handleUserClick(user)}
      className={`user-card p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
        selectedUser?._id === user._id
          ? "bg-violet-600/80 shadow-lg scale-[1.02]"
          : "bg-white/10 hover:bg-white/20 hover:scale-[1.01]"
      } border border-white/10 hover:border-white/30`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {(user.username || "U").charAt(0).toUpperCase()}
          </div>
          <span
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
              isOnline ? "bg-green-400 online-pulse" : "bg-gray-400"
            }`}
          ></span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white truncate">{user.username || "Unknown"}</div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <span className={`font-medium ${isOnline ? "text-green-300" : "text-gray-400"}`}>
              {isOnline ? "Online" : "Last seen recently"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[91.5vh] bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="max-w-7xl mx-auto h-[calc(100vh-3rem)] flex gap-6">
        
        {/* Left Sidebar - Users List */}
        <div className="sidebar w-80 bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col glass-overlay">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>{onlineUsersList.length} online</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white/20 transition-all border border-white/20"
            />
          </div>

          {loadingUsers && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-6 sidebar-scroll">
            {/* Online Users Section */}
            {filteredOnlineUsers.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <h3 className="text-sm font-semibold text-green-300 uppercase tracking-wide">
                    Online ({filteredOnlineUsers.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {filteredOnlineUsers.map((user, idx) => (
                    <UserCard key={user._id || idx} user={user} isOnline={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Offline Users Section */}
            {filteredOfflineUsers.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Offline ({filteredOfflineUsers.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {filteredOfflineUsers.map((user, idx) => (
                    <UserCard key={user._id || idx} user={user} isOnline={false} />
                  ))}
                </div>
              </div>
            )}

            {!loadingUsers && usersList.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-white/60">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Chat Area */}
        <div className="chat-area flex-1 bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col glass-overlay">
          {/* Chat Header */}
          {selectedUser ? (
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                      onlineUsers.includes(selectedUser._id) ? "bg-green-400 online-pulse" : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedUser.username}</h2>
                  <p className={`text-sm ${onlineUsers.includes(selectedUser._id) ? "text-green-300" : "text-gray-400"}`}>
                    {onlineUsers.includes(selectedUser._id) ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-semibold text-white">Select a conversation</h2>
              <p className="text-white/60">Choose from your contacts to start messaging</p>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 message-scroll">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : !selectedUser ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Welcome to Messages</h3>
                  <p className="text-white/60">Select a conversation from the sidebar to start chatting</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Start the conversation!</h3>
                  <p className="text-white/60">Send your first message to {selectedUser.username}</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                const isCurrentUserSender = senderId === user._id;

                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isCurrentUserSender ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col ${isCurrentUserSender ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
                      <div
                        className={`message-bubble px-4 py-3 rounded-2xl break-words ${
                          isCurrentUserSender
                            ? `bg-violet-600 text-white ${msg.isTemporary ? 'opacity-70' : ''}`
                            : "bg-white/20 text-white"
                        } shadow-lg`}
                      >
                        <p className="text-sm">{msg.content || ""}</p>
                        {msg.isTemporary && (
                          <div className="flex items-center mt-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white/70"></div>
                            <span className="ml-2 text-xs opacity-70">Sending...</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-white/50 mt-1 px-2">
                        {msg.createdAt ? formatMessageTime(msg.createdAt) : ""}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Message Input */}
          {selectedUser && (
            <div className="p-6 border-t border-white/20">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder={`Message ${selectedUser.username}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="message-input flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white/20 transition-all border border-white/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="send-button px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-xl transition-all font-medium text-white shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
