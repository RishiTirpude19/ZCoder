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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}`, { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserInfo();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='btp'>
        <button onClick={() => navigate(`/myprofile/${userId}/updateprofile`)}>
          Update Profile
        </button>
      </div>
      <div className="profile-container">
        <h1>{user.username}'s Profile</h1>
        <div className="profile-info">
          <h1>{user.collaborator ? ("Collaborator"):(<></>)}</h1>
          <button className='invitecollaborator' onClick={()=>{
            navigate(`/${user._id}/collaborator`)
          }}>Invite Collaborator</button>
          <p><strong>Email:</strong> {user.email}</p>
          {user.favlanguage && <p><strong>Favorite Language:</strong> {user.favlanguage}</p>}
          {user.rating && <p><strong>Rating:</strong> {user.rating}</p>}
          {user.platform && <p><strong>Platform:</strong> {user.platform}</p>}
          {user.gitHub && (
            <p><strong>GitHub:</strong> <a href={user.gitHub} target="_blank" rel="noopener noreferrer">{user.gitHub}</a></p>
          )}

          <div className="profile-section">
            <h3>Projects</h3>
            <ul>
              {user.projectslinks.length > 0 ? user.projectslinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </li>
              )) : <p>No projects linked yet.</p>}
            </ul>
          </div>

          <div className="profile-section">
            <h3>Skills</h3>
            <ul>
              {user.skills.length > 0 ? user.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              )) : <p>No skills listed yet.</p>}
            </ul>
          </div>

          <div className="profile-section">
            <h3>Bookmarked Problems</h3>
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
