import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Link as LinkIcon,
  PlusCircle,
  Save,
} from 'lucide-react';

function AddLink() {
  const [data, setData] = useState({
    name: '',
    link: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/implinks`,
        data,
        { withCredentials: true }
      );
      setSuccess('Link added successfully!');
      navigate('/importantlinks');
    } catch (error) {
      setError('Failed to add Link');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate('/importantlinks')}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 
                       text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all 
                       duration-200 border border-slate-600/50 hover:border-slate-600/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Links
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Add New Link</span>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
                        rounded-2xl shadow-2xl p-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 
                            rounded-2xl flex items-center justify-center mx-auto mb-4 
                            border border-blue-500/30">
              <PlusCircle className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Add Important Link</h1>
            <p className="text-slate-400">Save and share useful resources with the community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <label className="block text-sm font-medium text-slate-300 mb-2">Link Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                placeholder="Enter a name for the link"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 
                           rounded-lg text-white placeholder-slate-400 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                           transition-all duration-200"
              />
            </div>

            {/* Link */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
              <input
                type="url"
                name="link"
                value={data.link}
                onChange={handleChange}
                required
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 
                           rounded-lg text-white placeholder-slate-400 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                           transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 
                           hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 
                           rounded-xl font-semibold text-lg transition-all duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 
                           shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding Link...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Add Link
                  </>
                )}
              </button>
            </div>

            {/* Feedback */}
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

export default AddLink;
