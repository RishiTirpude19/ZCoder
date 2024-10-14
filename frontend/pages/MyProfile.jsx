import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyProfile.css'; 
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await axios.get(`http://localhost:8080/myprofile/${userId}`, { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserInfo();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className='btp'>
      <button onClick={()=>{
        navigate(`/myprofile/${userId}/updateprofile`)
      }}>Update Profile</button>
    </div>
    <div className="profile-container">
      <h1>{user.username}'s Profile</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
        {user.favlanguage && <p><strong>Favorite Language:</strong> {user.favlanguage}</p>}
        {user.rating && <p><strong>Rating:</strong> {user.rating}</p>}
        {user.platform && <p><strong>Platform:</strong> {user.platform}</p>}
        <div className="profile-section">
          {/* <h3>Problems Submitted:</h3>
          <ul>
            {user.problems.length > 0 ? user.problems.map((problem) => (
              <li key={problem._id}>{problem.title}</li>
            )) : <p>No problems submitted yet.</p>}
          </ul> */}
        </div>
        <div className="profile-section">
          {/* <h3>Solutions Submitted:</h3>
          <ul>
            {user.solutions.length > 0 ? user.solutions.map((solution) => (
              <li key={solution._id}>Solution ID: {solution._id}</li>
            )) : <p>No solutions submitted yet.</p>}
          </ul> */}
        </div>
        <div className="profile-section">
          <h3>Bookmarked Problems:</h3>
          <ul>
            {user.otherBookMarkedProblems.length > 0 ? user.otherBookMarkedProblems.map((problem) => (
              <li key={problem._id}>{problem.title}</li>
            )) : <p>No bookmarked problems yet.</p>}
          </ul>
        </div>
      </div>
    </div>
    </>
    
  );
}

export default MyProfile;
