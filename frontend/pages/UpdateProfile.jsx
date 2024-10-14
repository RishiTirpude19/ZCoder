import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./UpdateProfile.css";


function UpdateProfile() {
  const [formData, setFormData] = useState({
    favlanguage: '',
    rating: '',
    platform: '',
  });
  const navigate = useNavigate();

  const {userId} = useParams()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`http://localhost:8080/myprofile/${userId}`, { withCredentials: true });
        const user = response.data.user;
        setFormData({
          favlanguage: user.favlanguage || '',
          rating: user.rating || '',
          platform: user.platform || '',
        });
      } catch (error) {
        setError('Failed to fetch user data');
      }
    }

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        `http://localhost:8080/myprofile/${userId}/updateprofile`,
        formData,
        { withCredentials: true }
      );
      navigate("/myprofile");
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
      <button onClick={()=>{
        navigate("/myprofile")
      }}>Go back!</button>
    </div>
        <div className="update-profile-container">
      <h1>Update Your Profile</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="update-profile-form" onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
    </>

  );
}

export default UpdateProfile;


