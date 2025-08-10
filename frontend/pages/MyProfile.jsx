import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MyProfile() {
  const userId = useSelector((state) => state.user.user)._id;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] pt-12 pb-10 px-4 flex justify-center">

      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-center sm:text-left select-none cursor-default">{user.username}'s Profile</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => navigate(`/myprofile/${userId}/updateprofile`)}
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition duration-300 select-none cursor-default"
            >
              Update Profile
            </button>
            <button
              onClick={() => navigate(`/${user._id}/collaborator`)}
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition duration-300 select-none cursor-default"
            >
              Invite Collaborator
            </button>
          </div>
        </div>

        {user.collaborator && (
          <p className="italic text-white/80 mb-4 text-center sm:text-left">You are a Collaborator</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p><strong>Email:</strong> {user.email}</p>
            {user.favlanguage && <p><strong>Favorite Language:</strong> {user.favlanguage}</p>}
            {user.rating && <p><strong>Rating:</strong> {user.rating}</p>}
            {user.platform && <p><strong>Platform:</strong> {user.platform}</p>}
            {user.gitHub && (
              <p>
                <strong>GitHub:</strong>{" "}
                <a href={user.gitHub} target="_blank" rel="noopener noreferrer" className="underline hover:text-violet-200">
                  {user.gitHub}
                </a>
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 border-b border-white/30 pb-1">Projects</h3>
              <ul className="list-disc list-inside space-y-1 text-white/90">
                {user.projectslinks.length > 0 ? user.projectslinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:text-violet-200">{link}</a>
                  </li>
                )) : <p className="italic text-white/70">No projects linked yet.</p>}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 border-b border-white/30 pb-1">Skills</h3>
              <ul className="list-disc list-inside space-y-1 text-white/90">
                {user.skills.length > 0 ? user.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                )) : <p className="italic text-white/70">No skills listed yet.</p>}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2 border-b border-white/30 pb-1">Bookmarked Problems</h3>
          <ul className="list-disc list-inside space-y-1 text-white/90">
            {user.otherBookMarkedProblems.length > 0 ? user.otherBookMarkedProblems.map((problem) => (
              <li key={problem._id}>{problem.title}</li>
            )) : <p className="italic text-white/70">No bookmarked problems yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
