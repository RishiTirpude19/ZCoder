// ProblemDiscussion.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import "./ProblemDiscussion.css";
import axios from 'axios';

function ProblemDiscussion() {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socketRef = useRef(null); 


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    console.error("No userId found in localStorage.");
                    navigate('/login'); 
                    return;
                }

                const response = await axios.get(`http://localhost:8080/myprofile/${userId}`, { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user info:", error);
                
            }
        };
        fetchUserInfo();
    }, [navigate]);

    
    useEffect(() => {
        
        const token = localStorage.getItem('token'); 
        if (!token) {
            console.error("No token found. Please log in.");
            navigate('/login'); 
            return;
        }

        
        socketRef.current = io('http://localhost:8080', {
            auth: { token },
            withCredentials: true, 
        });

        
        socketRef.current.on('connect_error', (err) => {
            console.error("Connection Error:", err.message);
        });

        
        socketRef.current.emit('joinRoom', problemId);

        
        socketRef.current.on('chatHistory', (history) => {
            setMessages(history);
        });

        
        socketRef.current.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [problemId, navigate]);

    
    useEffect(() => {
        if (user) {
            console.log("User state updated:", user);
        }
        if (messages) {
            console.log("Messages state updated:", messages);
        }
    }, [user]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && socketRef.current) {
            socketRef.current.emit('chatMessage', { problemId, message: input });
            setInput('');
        }
    };

    return (
        <div className="discussion-room">
            <h2>Discussion Room</h2>
            
            
            {user ? (
                <>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user === user.username ? 'own' : ''}`}>
                                <p >{msg.user}:</p> <p>{msg.text}</p>
                                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} className="message-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                    <div className='btp'>
                        <button onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </>
            ) : (
                <div>Loading user information...</div>
            )}
        </div>
    );
}

export default ProblemDiscussion;
