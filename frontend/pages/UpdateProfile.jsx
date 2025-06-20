import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProfile() {
  const [formData, setFormData] = useState({
    favlanguage: '',
    rating: '',
    platform: '',
    gitHub: '',
    projectslinks: [''],
    skills: [''],
    collaborator: false,
  });

  const navigate = useNavigate();
  const { userId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}`, {
          withCredentials: true,
        });
        const user = response.data.user;
        setFormData({
          favlanguage: user.favlanguage || '',
          rating: user.rating || '',
          platform: user.platform || '',
          gitHub: user.gitHub || '',
          projectslinks: user.projectslinks || [''],
          skills: user.skills || [''],
          collaborator: user.collaborator || false,
        });
      } catch {
        setError('Failed to fetch user data');
      }
    }

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[name]];
    updatedArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [name]: updatedArray,
    }));
  };

  const handleAddItem = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ''],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}/updateprofile`,
        formData,
        { withCredentials: true }
      );
      navigate(`/myprofile/${userId}`);
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Update Profile</h1>
          <button
            onClick={() => navigate(`/myprofile/${userId}`)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md font-medium text-sm text-white bg-violet-600 px-3 py-1 rounded-md hover:bg-violet-700"
          >
            Go Back
          </button>
        </div>

        {error && <p className="text-red-200 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-200 mb-4 text-center">{success}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-1">Favorite Language</label>
              <input
                type="text"
                name="favlanguage"
                value={formData.favlanguage}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-base mb-1">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-1">Platform</label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-base mb-1">GitHub</label>
              <input
                type="url"
                name="gitHub"
                value={formData.gitHub}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-2">Project Links</label>
              {formData.projectslinks.map((link, i) => (
                <input
                  key={i}
                  type="text"
                  name="projectslinks"
                  value={link}
                  onChange={(e) => handleArrayChange(i, e)}
                  className="w-full mb-2 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              ))}
              <button
                type="button"
                onClick={() => handleAddItem('projectslinks')}
                className="text-sm text-white bg-violet-600 px-3 py-1 rounded-md hover:bg-violet-700"
              >
                + Add Project
              </button>
            </div>

            <div>
              <label className="block text-base mb-2">Skills</label>
              {formData.skills.map((skill, i) => (
                <input
                  key={i}
                  type="text"
                  name="skills"
                  value={skill}
                  onChange={(e) => handleArrayChange(i, e)}
                  className="w-full mb-2 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              ))}
              <button
                type="button"
                onClick={() => handleAddItem('skills')}
                className="text-sm text-white bg-violet-600 px-3 py-1 rounded-md hover:bg-violet-700"
              >
                + Add Skill
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base">Open to Collaborate?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.collaborator}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, collaborator: e.target.checked }))
                }
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:bg-violet-600 transition"></div>
              <span className="ml-3 text-sm text-white font-medium">
                {formData.collaborator ? 'Yes' : 'No'}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
