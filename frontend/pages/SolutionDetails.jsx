import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Code2, MessageSquare, Edit3, Trash2, User, Lightbulb, FileText, Star, Loader2, Plus } from "lucide-react";

function SolutionDetails() {
  const navigate = useNavigate();
  const { solutionId, problemId } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolution() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions/${solutionId}`,
          { withCredentials: true }
        );
        setSolution(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSolution();
  }, [solutionId, problemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading solution details...</p>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code2 className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Solution Not Found</h3>
          <p className="text-slate-400 mb-6">Unable to load solution details</p>
          <button
            onClick={() => navigate(`/problem/${problemId}/solutions`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Back to Solutions
          </button>
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
              onClick={() => navigate(`/problem/${problemId}/solutions`)}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Solutions
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Code2 className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Solution Details</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Solution</span>
              </h1>
              <p className="text-slate-400">Detailed view of the coding solution</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/problem/${problemId}/solutions/${solutionId}/reviews`)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Reviews ({solution.reviews?.length || 0})
              </button>
              <button
                onClick={() => navigate(`/problem/${problemId}/solutions/${solutionId}/updatesolution`)}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Update
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this solution?')) {
                    await axios.delete(
                      `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions/${solutionId}/deletesolution`,
                      { withCredentials: true }
                    );
                    navigate(`/problem/${problemId}/solutions`);
                  }
                }}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          
          {/* Solution Header */}
          <div className="text-center mb-8 pb-6 border-b border-slate-700/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Solution by{' '}
              <span className="text-blue-400">
                @{solution.user ? solution.user.username : 'Unknown User'}
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                <span>{solution.user ? solution.user.username : 'Unknown User'}</span>
              </div>
              {solution.reviews && solution.reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{solution.reviews.length} review{solution.reviews.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Approach & Description */}
            <div className="space-y-6">
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-400" />
                  Approach
                </h3>
                <p className="text-slate-300 leading-relaxed">{solution.approach}</p>
              </div>

              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-green-400" />
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">{solution.description}</p>
              </div>
            </div>

            {/* Right Column - Code */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Code2 className="h-6 w-6 text-blue-400" />
                Code
              </h3>
              <div className="bg-slate-800/80 border border-slate-600/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-300 font-mono text-sm leading-relaxed">
                  <code>{solution.code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-8 pt-6 border-t border-slate-700/50">
            <button
              onClick={() =>
                navigate(`/problem/${problemId}/solutions/${solutionId}/addreview`)
              }
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionDetails;
