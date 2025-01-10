import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./UpdateProfile.css";

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

  // Fetch user profile on component mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`https://z-coder.vercel.app/myprofile/${userId}`, { withCredentials: true });
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
      } catch (error) {
        setError('Failed to fetch user data');
      }
    }

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[name]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [name]: updatedArray,
    });
  };

  const handleAddItem = (name) => {
    setFormData({
      ...formData,
      [name]: [...formData[name], ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        `https://z-coder.vercel.app/myprofile/${userId}/updateprofile`,
        formData,
        { withCredentials: true }
      );
      navigate(`/myprofile/${userId}`);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='btp'>
        <button onClick={() => navigate(`/myprofile/${userId}`)}>Go back!</button>
      </div>
      <div className="update-profile-container">
        <h1>Update Your Profile</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form className="update-profile-form" onSubmit={handleSubmit}>
          {/* Existing Fields */}
          <div className="form-group">
            <label htmlFor="favlanguage">Favorite Language</label>
            <input
              type="text"
              id="favlanguage"
              name="favlanguage"
              value={formData.favlanguage}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="platform">Platform</label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
            />
          </div>

          {/* New Fields */}
          <div className="form-group">
            <label htmlFor="gitHub">GitHub</label>
            <input
              type="text"
              id="gitHub"
              name="gitHub"
              value={formData.gitHub}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Projects Links</label>
            {formData.projectslinks.map((link, index) => (
              <input
                key={index}
                type="text"
                name="projectslinks"
                value={link}
                onChange={(e) => handleArrayChange(index, e)}
              />
            ))}
            <button type="button" onClick={() => handleAddItem('projectslinks')}>Add Project Link</button>
          </div>

          <div className="form-group">
            <label>Skills</label>
            {formData.skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                name="skills"
                value={skill}
                onChange={(e) => handleArrayChange(index, e)}
              />
            ))}
            <button type="button" onClick={() => handleAddItem('skills')}>Add Skill</button>
          </div>

          <div className="form-group collaborator-group">
          <label htmlFor="collaborator">Collaborator</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="collaborator"
              name="collaborator"
              checked={formData.collaborator}
              onChange={(e) => setFormData({ ...formData, collaborator: e.target.checked })}
            />
            <span className="slider"></span>
          </div>
        </div>


          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </>
  );
}

export default UpdateProfile;
