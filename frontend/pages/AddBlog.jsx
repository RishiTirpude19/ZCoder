import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  PenSquare,
  BookOpen,
  Save,
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/blogs`)}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 
                         text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all 
                         duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blogs
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <PenSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Add New Blog</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-blue-800/20 
                            rounded-2xl flex items-center justify-center mx-auto mb-4 
                            border border-blue-500/30">
              <BookOpen className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Blog</h1>
            <p className="text-slate-400">Share your knowledge and insights with the community</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Blog Info */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Blog Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Blog Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter blog title"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 
                               rounded-lg text-white placeholder-slate-400 focus:outline-none 
                               focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                               transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">About</label>
                  <input
                    type="text"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    required
                    placeholder="Short description of blog"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 
                               rounded-lg text-white placeholder-slate-400 focus:outline-none 
                               focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                               transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Blog Content
              </h2>

              <textarea
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Write your blog content here..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 
                           rounded-lg text-white placeholder-slate-400 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                           transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="group bg-gradient-to-r from-blue-600 to-blue-800 
                           hover:from-blue-700 hover:to-blue-900 text-white px-8 py-4 
                           rounded-xl font-semibold text-lg transition-all duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 
                           shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding Blog...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Add Blog
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-sm text-green-400 text-center">{success}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBlog;
