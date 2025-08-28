import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Code2, 
  Plus, 
  Link as LinkIcon, 
  FileText, 
  Eye, 
  Globe, 
  Star,
  Save,
  Terminal,
  SquareTerminal
} from 'lucide-react';

function AddProblem() {
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [mainKey, subKey] = name.split('.');
        if (subKey) {
            setFormData(prevFormData => ({
                ...prevFormData,
                [mainKey]: {
                    ...prevFormData[mainKey],
                    [subKey]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addproblem`, formData, {
                withCredentials: true,
            });
            setSuccess(response.data.message);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
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
                            onClick={() => navigate(`/dashboard`)}
                            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Add New Problem</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <Code2 className="h-10 w-10 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create New Problem</h1>
                        <p className="text-slate-400">Share your coding challenge with the community</p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-400" />
                                Basic Information
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Problem Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter problem title"
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Problem Link</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LinkIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="url"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleChange}
                                            required
                                            placeholder="https://example.com/problem"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Problem Statement */}
                        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-green-400" />
                                Problem Statement
                            </h2>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Problem Description</label>
                                <textarea
                                    rows={6}
                                    name="problemstatement.statement"
                                    value={formData.problemstatement.statement}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describe the problem in detail..."
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <Terminal className="h-4 w-4 text-blue-400" />
                                        Input Format
                                    </label>
                                    <textarea
                                        rows={4}
                                        name="problemstatement.input"
                                        value={formData.problemstatement.input}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe the input format..."
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <SquareTerminal className="h-4 w-4 text-green-400" />
                                        Output Format
                                    </label>
                                    <textarea
                                        rows={4}
                                        name="problemstatement.output"
                                        value={formData.problemstatement.output}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe the expected output..."
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-yellow-400" />
                                Examples
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Example Input</label>
                                    <textarea
                                        rows={4}
                                        name="problemstatement.exampleinput"
                                        value={formData.problemstatement.exampleinput}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter example input..."
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 resize-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Example Output</label>
                                    <textarea
                                        rows={4}
                                        name="problemstatement.exampleoutput"
                                        value={formData.problemstatement.exampleoutput}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter expected output..."
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 resize-none font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Platform & Settings */}
                        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-purple-400" />
                                Platform & Settings
                            </h2>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-blue-400" />
                                        Visibility
                                    </label>
                                    <select
                                        name="choice"
                                        value={formData.choice}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-green-400" />
                                        Platform Name
                                    </label>
                                    <input
                                        type="text"
                                        name="platform.name"
                                        value={formData.platform.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., LeetCode, HackerRank"
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        Difficulty Rating
                                    </label>
                                    <input
                                        type="number"
                                        name="platform.rating"
                                        value={formData.platform.rating}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="10"
                                        placeholder="1-10"
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Creating Problem...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Create Problem
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

export default AddProblem;
