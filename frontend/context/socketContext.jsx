
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    console.log("Creating socket connection for user:", user._id);
    
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      query: {
        userId: user._id, 
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("Online users updated:", userIds);
      setOnlineUsers(userIds);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      console.log("Cleaning up socket connection");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user?._id]); // Only depend on user ID to prevent unnecessary reconnections

  return (
    <SocketContext.Provider value={{socket , onlineUsers}} >
      {children}
    </SocketContext.Provider>
  );
};
