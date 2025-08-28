import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Code2, Lightbulb, FileText, Send, Loader2 } from "lucide-react";

function AddSolution() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    approach: '',
    description: '',
    code: '',
    problem: problemId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/addsolution`,
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      setSuccess(response.data.message);
      navigate(`/problem/${problemId}`);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

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
                <Code2 className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Share Solution</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Add a Solution</span>
              </h1>
              <p className="text-slate-400">Share your approach and code to help others</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">New Solution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Approach + Description */}
            <div className="space-y-6">
              
              {/* Approach Section */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-400" />
                  Approach
                </h3>
                <label className="block mb-3 font-medium text-slate-300">Describe your approach</label>
                <textarea
                  name="approach"
                  rows={5}
                  value={formData.approach}
                  onChange={handleChange}
                  required
                  placeholder="Describe your approach here... What was your thought process? What algorithms or data structures did you use?"
                  className="w-full p-4 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 transition-all border border-slate-600/50 resize-none"
                />
              </div>

              {/* Description Section */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-green-400" />
                  Description
                </h3>
                <label className="block mb-3 font-medium text-slate-300">Explain the solution in detail</label>
                <textarea
                  name="description"
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Explain the solution in detail... How does it work? What are the time and space complexities? Any edge cases to consider?"
                  className="w-full p-4 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 transition-all border border-slate-600/50 resize-none"
                />
              </div>
            </div>

            {/* Right Column - Code */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Code2 className="h-6 w-6 text-blue-400" />
                Code
              </h3>
              <label className="block mb-3 font-medium text-slate-300">Paste your solution code</label>
              <textarea
                name="code"
                rows={18}
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="Paste your code here... Make sure it's well-formatted and includes any necessary comments."
                className="w-full p-4 font-mono text-sm rounded-xl bg-slate-800/80 text-green-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-800/90 transition-all border border-slate-600/50 resize-none"
              />
            </div>

            {/* Full Width Submit Button */}
            <div className="lg:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Solution...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Solution
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="lg:col-span-2 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            {success && (
              <div className="lg:col-span-2 bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                <p className="text-green-200">{success}</p>
              </div>
            )}
          </form>

          {/* Tips */}
          <div className="mt-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600/50">
            <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-3">
              <Lightbulb className="h-5 w-5" />
              Solution Writing Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
              <div>
                <h5 className="font-medium text-white mb-2">For Approach & Description:</h5>
                <ul className="space-y-1">
                  <li>• Explain your thought process step by step</li>
                  <li>• Mention the algorithms/data structures used</li>
                  <li>• Include time and space complexity analysis</li>
                  <li>• Highlight any optimizations made</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">For Code:</h5>
                <ul className="space-y-1">
                  <li>• Use clear variable and function names</li>
                  <li>• Add comments for complex logic</li>
                  <li>• Ensure proper formatting and indentation</li>
                  <li>• Test your code before submitting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSolution;
