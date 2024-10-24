import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddBlog.css';

function AddBlog() {
 
  const [formData, setFormData] = useState({
    title: '',
    about: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

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
      const response = await axios.post(
        'http://localhost:8080/blogs/addblog', // Your backend endpoint for adding blogs
        formData,
        { withCredentials: true } // If you're using cookies for authentication
      );
      setSuccess('Blog added successfully!');
      navigate('/blogs'); // Redirect to the blogs page after successful submission
    } catch (error) {
      setError('Failed to add blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <>
    <div className='btp'>
      <button onClick={()=>{
        navigate("/blogs")
      }}>Blogs</button>
    </div>
    <div className="add-blog-container">
      <h1>Add a New Blog</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="add-blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="about">About</label>
          <input
            type="text"
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Blog...' : 'Add Blog'}
        </button>
      </form>
    </div>
    </>
    
  );
}

export default AddBlog;
