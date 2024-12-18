import React, { useEffect, useState } from "react";
import "./Messages.css";
import axios from "axios";

function Messages() {
  const loggedUserId = localStorage.getItem("userId");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadChats, setLoadChats] = useState([]);
  const [intialChats, setIntialChats] = useState([]);
  const [refreshChats, setRefreshChats] = useState(false); // State to trigger useEffect

  // Fetch chats when the component mounts or when refreshChats changes
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/chat`, { withCredentials: true });
        console.log(response.data.chats);
        setIntialChats(response.data.chats);
        //setLoadChats(response.data.chats); // Ensure loadChats is updated
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [refreshChats]); // Add refreshChats as a dependency

  const handleChat = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.post(`http://localhost:8080/chat`, { userId }, { withCredentials: true });
      console.log(response.data);
      setRefreshChats((prev) => !prev);
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!search.trim()) {
      alert("Please enter a search query.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/searchuser?query=${search}`, { withCredentials: true });
      console.log(response.data);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setSearch("");
    }
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
          {loading ? "Searching..." : "Search"}
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
        ) : (
          <> </>
        )}
      </div>
<div className="chats">
  {intialChats.length > 0 ? (
    <ul className="results-list">
      {intialChats.map((chat) => {
        const otherUser = chat.users.find((user) => user._id !== loggedUserId);
        return (
          <li key={chat._id}>
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
        {loadChats && loadChats.length === 0 && <p style={{color:"white"}}>No chats available.</p>}
        {loadChats && loadChats.length > 0 && (
          <ul>
            {loadChats.map((chat) => (
              <li key={chat._id}>{chat.chatName || "Unnamed Chat"}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Messages;
