import React, { useState } from 'react';
import axios from 'axios';
import "../Styles/HireCollaborators.css";
import { useNavigate } from 'react-router-dom';

function HireCollaboraters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
      if (!searchQuery) {
            alert('Please enter a search term.');
            return;
        }
        try {
          const response = await  axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchuser?query=${searchQuery}` , {withCredentials:true});
          setSearchResults(response.data);
          setSearchQuery("");
        } catch (error) {
          console.log(error);
          alert('Error fetching search results.');
        }
  };

  return (
    <div>
      <div className='container1'>
        <div className='chats1' style={{display:"flex", justifyContent:"center" ,alignContent:"center"}}>
          Notifications
        </div>
        <div className='chat-box1'>
          <input 
            type="text" 
            placeholder='Search Collaborator' 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button onClick={handleSearch}>Search</button>
          <hr />
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((collaborator) => (
                <div key={collaborator._id} className="collaborator-item" onClick={()=>{
                  navigate(`/profile/${collaborator._id}`)
                }}>
                  {collaborator.username}
                </div>
              ))
            ) : (
              <p>No collaborators found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HireCollaboraters;
