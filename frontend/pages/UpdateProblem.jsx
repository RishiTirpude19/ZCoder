import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Code2, Globe, Link as LinkIcon, FileText, Settings, Loader2, Save } from "lucide-react";

function UpdateProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    problemstatement: {
      statement: '',
      input: '',
      output: '',
      exampleinput: '',
      exampleoutput: '',
    },
    choice: 'public',
    platform: {
      name: '',
      rating: '',
    },
    link: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}`, {
          withCredentials: true,
        });
        setFormData(response.data.problem);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemDetails();
  }, [problemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setFormData(prev => ({
        ...prev,
        [mainKey]: {
          ...prev[mainKey],
          [subKey]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/updateproblem`,
        formData,
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      navigate(`/problem/${problemId}`);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading problem details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/problem/${problemId}`)}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problem
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Edit3 className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Edit Problem</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Update Problem</span>
              </h1>
              <p className="text-slate-400">Modify your problem details and settings</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Code2 className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Problem Editor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* Basic Information */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-400" />
                Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white">Problem Link</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Code2 className="h-6 w-6 text-green-400" />
                Problem Statement
              </h3>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium text-white">Problem Description</label>
                <textarea
                  name="problemstatement.statement"
                  rows={6}
                  value={formData.problemstatement.statement}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Input Format</label>
                  <textarea
                    name="problemstatement.input"
                    rows={4}
                    value={formData.problemstatement.input}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white">Output Format</label>
                  <textarea
                    name="problemstatement.output"
                    rows={4}
                    value={formData.problemstatement.output}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Example Input</label>
                  <textarea
                    name="problemstatement.exampleinput"
                    rows={4}
                    value={formData.problemstatement.exampleinput}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white">Example Output</label>
                  <textarea
                    name="problemstatement.exampleoutput"
                    rows={4}
                    value={formData.problemstatement.exampleoutput}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Platform & Settings */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="h-6 w-6 text-purple-400" />
                Platform & Settings
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Visibility</label>
                  <select
                    name="choice"
                    value={formData.choice}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white">Platform Name</label>
                  <input
                    type="text"
                    name="platform.name"
                    value={formData.platform.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white">Difficulty Rating</label>
                  <input
                    type="number"
                    name="platform.rating"
                    value={formData.platform.rating}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating Problem...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Update Problem
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                <p className="text-green-200">{success}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProblem;
