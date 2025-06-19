import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/addblog`,
        formData,
        { withCredentials: true }
      );
      setSuccess('Blog added successfully!');
      navigate('/blogs');
    } catch (error) {
      setError('Failed to add blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-white">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold select-none">Add a New Blog</h1>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300 select-none cursor-default"
          >
            View Blogs
          </button>
        </div>

        {error && <p className="text-sm text-red-200 mb-4 text-center">{error}</p>}
        {success && <p className="text-sm text-green-200 mb-4 text-center">{success}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-base mb-1">About</label>
              <input
                type="text"
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-base mb-1">Content</label>
            <textarea
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Blog...' : 'Add Blog'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddBlog;
