import React, { useState } from 'react'
import axios from 'axios';
function MessageBox({selectedChat, messages}) {
  const [message,setMessage] = useState('');
  
  const sendMessage =async (selectedChat) => {
    try {
      const chatId = selectedChat;
      const content = message;
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/message`, {chatId, content} ,{withCredentials: true});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div>
      
      <input type="text" name="message" placeholder='Type message' onChange={(e)=>{
        setMessage(e.target.value);
      }}/>
      <button onClick={()=>{
        sendMessage(selectedChat)
      }}>Send</button>
    </div>
  )
}

export default MessageBox
