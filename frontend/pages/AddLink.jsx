import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddLink() {
  const [data , setData] = useState({
    name : "",
    link : ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate =  useNavigate();

  const handleChange = (e)=>{
    const {name , value} = e.target;
    setData({
      ... data , 
      [name] : value
    })
  }

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/implinks`, 
        data,
        { withCredentials: true } 
      );
      setSuccess('Link added successfully!');
      navigate('/importantlinks');
    } catch (error) {
      setError('Failed to add Link');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className='btp'>
      <button onClick={()=>{
        navigate("/importantlinks")
      }}>Back</button>
    </div>
    <div className="add-blog-container">
      <h1>Add a Link</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="add-blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Name</label>
          <input
            type="text"
            id="title"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            type="text"
            id="link"
            name="link"
            value={data.link}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Link...' : 'Add Link'}
        </button>
      </form>
    </div>
    </>
  )
}

export default AddLink
