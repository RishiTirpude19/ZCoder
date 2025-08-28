import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatMessageTime } from "../utils/DateTime";
import { useSocket } from "../context/socketContext";
import { Loader2, MessageSquare, Search, SendHorizonal, Users } from "lucide-react";
import "./Messages.css";

// --- The UserCard component and all logic functions remain the same ---
const UserCard = ({ user, isOnline, onClick, isSelected }) => (
    <div
      onClick={() => onClick(user)}
      className={`p-3 rounded-xl cursor-pointer transition-all duration-300 group flex items-center gap-4 border ${
        isSelected
          ? "bg-blue-600/30 border-blue-500/60 scale-[1.03]"
          : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {(user.username || "U").charAt(0).toUpperCase()}
        </div>
        <span
          className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-800 ${
            isOnline ? "bg-green-400" : "bg-slate-500"
          }`}
        ></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{user.username || "Unknown"}</div>
        <p className={`text-sm ${isOnline ? "text-green-400" : "text-slate-400"}`}>
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );

const Message = () => {
  const user = useSelector((state) => state.user.user);
  const { onlineUsers, socket } = useSocket();
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
      if (!selectedUser) return;
      const senderId = typeof message.sender === "object" ? message.sender._id : message.sender;
      const receiverId = typeof message.receiver === "object" ? message.receiver._id : message.receiver;
      const isRelevantMessage =
        (senderId === selectedUser._id && receiverId === user._id) ||
        (senderId === user._id && receiverId === selectedUser._id);
      if (isRelevantMessage) {
        setMessages((prev) => {
          const messageExists = prev.some(m => m._id === message._id);
          if (!messageExists) {
            return [...prev, message];
          }
          return prev;
        });
      }
    };
    const handleMessageSent = (message) => {
      if (selectedUser) {
        const senderId = typeof message.sender === "object" ? message.sender._id : message.sender;
        const receiverId = typeof message.receiver === "object" ? message.receiver._id : message.receiver;
        const isRelevantMessage =
          (senderId === user._id && receiverId === selectedUser._id);
        if (isRelevantMessage) {
          setMessages((prev) => {
            const messageExists = prev.some(m => m._id === message._id);
            if (!messageExists) {
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/users`, { withCredentials: true });
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/${clickedUser._id}`, { withCredentials: true });
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
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/messages/send/${selectedUser._id}`, { content: messageContent }, { withCredentials: true });
      setMessages((prev) =>
        prev.map(msg =>
          msg._id === tempMessageId ? response.data : msg
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter(msg => msg._id !== tempMessageId));
      alert("Failed to send message. Please try again.");
    }
  };

  const onlineUsersList = usersList.filter(u => onlineUsers.includes(u._id));
  const offlineUsersList = usersList.filter(u => !onlineUsers.includes(u._id));
  const filteredOnlineUsers = onlineUsersList.filter(u => (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOfflineUsers = offlineUsersList.filter(u => (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/*
        CHANGE 1: This is now the main flex container.
        - h-full: Takes the full height of its parent (the h-screen div).
        - flex: Enables flexbox layout.
        - flex-col lg:flex-row: Stacks the boxes vertically on mobile and places them side-by-side on large screens.
      */}
      <div className="max-w-7xl w-full mx-auto h-180 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">

        {/*
          CHANGE 2: This is the Left Sidebar.
          - It's now a direct child of the flex container.
          - lg:w-[400px]: A fixed width on large screens for stability.
          - lg:flex-shrink-0: Prevents this column from shrinking.
          - flex flex-col: This is crucial for its internal layout to work correctly.
        */}
        <div className="w-full lg:w-[400px] lg:flex-shrink-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="h-7 w-7 text-blue-400" />
              Conversations
            </h2>
            <div className="text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
              {onlineUsersList.length} Online
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-slate-600"
            />
          </div>

          {loadingUsers ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 sidebar-scroll -mr-3 pr-3 min-h-0">
              {filteredOnlineUsers.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Online</h3>
                  <div className="space-y-2">
                    {filteredOnlineUsers.map((u) => <UserCard key={u._id} user={u} isOnline={true} onClick={handleUserClick} isSelected={selectedUser?._id === u._id} />)}
                  </div>
                </div>
              )}
              {filteredOfflineUsers.length > 0 && (
                <div className={filteredOnlineUsers.length > 0 ? "mt-4" : ""}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Offline</h3>
                  <div className="space-y-2">
                    {filteredOfflineUsers.map((u) => <UserCard key={u._id} user={u} isOnline={false} onClick={handleUserClick} isSelected={selectedUser?._id === u._id} />)}
                  </div>
                </div>
              )}
              {usersList.length === 0 && !error && (
                <div className="text-center py-16 text-slate-400">
                  <Users className="h-10 w-10 mx-auto mb-4" />
                  <p>No other users found.</p>
                </div>
              )}
              {error && <p className="text-center text-red-400">{error}</p>}
            </div>
          )}
        </div>

        {/*
          CHANGE 3: This is the Center Chat Area.
          - flex-1: Makes this column grow to fill the remaining horizontal space.
          - min-w-0: Prevents wide content (like long messages) from breaking the layout.
          - flex flex-col: Again, essential for managing its internal header, content, and footer.
        */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl flex flex-col min-w-0">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-slate-700/50 flex items-center gap-4 flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-800 ${onlineUsers.includes(selectedUser._id) ? "bg-green-400" : "bg-slate-500"}`}></span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedUser.username}</h2>
                  <p className={`text-sm ${onlineUsers.includes(selectedUser._id) ? "text-green-400" : "text-slate-400"}`}>
                    {onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 message-scroll min-h-0">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full">
                    <MessageSquare className="h-12 w-12 mb-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-300">No messages yet</h3>
                    <p>Be the first to send a message to {selectedUser.username}.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                    const isCurrentUserSender = senderId === user._id;
                    return (
                      <div key={msg._id || msg.tempMessageId} className={`flex items-end gap-2 ${isCurrentUserSender ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col space-y-1 text-sm max-w-xs mx-2 order-2 ${isCurrentUserSender ? "items-end" : "items-start"}`}>
                          <div className={`px-4 py-2 rounded-2xl inline-block ${isCurrentUserSender ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-700 text-slate-200 rounded-bl-none"}`}>
                            {msg.content}
                            {msg.isTemporary && <span className="text-xs opacity-70 ml-2"> (sending...)</span>}
                          </div>
                          <span className="text-xs text-slate-500">{formatMessageTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-slate-600"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <SendHorizonal className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
              <MessageSquare className="h-16 w-16 mb-6 text-slate-600" />
              <h2 className="text-2xl font-bold text-white mb-2">Select a Conversation</h2>
              <p>Choose a user from the list to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Message;