// ProblemDiscussion.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import "./ProblemDiscussion.css";
import axios from 'axios';
import { useSelector } from 'react-redux';

function ProblemDiscussion() {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
 


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = useSelector((state) => state.user.user._id);
                console.log(userId);
                if (!userId) {
                    console.error("No userId found in sessionStorage.");
                    navigate('/login'); 
                    return;
                }

                const response = await axios.get(`https://z-coder.vercel.app/myprofile/${userId}`, { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user info:", error);
                
            }
        };
        fetchUserInfo();
    }, [navigate]);

    

    
    useEffect(() => {
        if (user) {
            console.log("User state updated:", user);
        }
        if (messages) {
            console.log("Messages state updated:", messages);
        }
    }, [user]);


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
