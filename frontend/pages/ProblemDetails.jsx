import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Code2, 
  MessageSquare, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Users, 
  Eye,
  Plus,
  MessageCircle
} from 'lucide-react';

function ProblemDetail() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const currentUserId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}`, {
          withCredentials: true
        });
        setProblem(response.data.problem);
        setIsBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProblem();
  }, [problemId]);

  async function handleAddSolution() {
    navigate(`/problem/${problemId}/addsolution`);
  }

  async function handleProblemReview() {
    navigate(`/problem/${problemId}/addreview`);
  }

  async function handleSolution() {
    navigate(`/problem/${problemId}/solutions`);
  }

  async function handleBookmark() {
    try {
      if (isBookmarked) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/unbookmark/${problemId}`, {}, { withCredentials: true });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookmark/${problemId}`, {}, { withCredentials: true });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log(error);
    }
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading problem details...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
                <Code2 className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300 text-sm">{problem.platform?.name || 'Platform'}</span>
              </div>
              {problem.platform?.rating && (
                <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg border border-yellow-500/30">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-medium">{problem.platform.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Problem Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{problem.title}</h1>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>By @{problem.user.username}</span>
                </div>
                {problem.choice && (
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="capitalize">{problem.choice}</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isBookmarked
                  ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30 hover:bg-pink-600/30'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/70 hover:text-white'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button 
              onClick={handleSolution} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              <Code2 className="h-4 w-4" />
              Solutions ({problem.solutions?.length || 0})
            </button>
            <button 
              onClick={() => navigate(`/problem/${problemId}/reviews`)} 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              <Star className="h-4 w-4" />
              Reviews ({problem.reviews?.length || 0})
            </button>
            <button 
              onClick={() => navigate(`/problem/${problemId}/discussion`)} 
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Join Discussion
            </button>
          </div>

          {/* Owner Actions */}
          {currentUserId === problem.user._id && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
              <button 
                onClick={() => navigate(`/problem/${problemId}/updateproblem`)} 
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Edit className="h-4 w-4" />
                Update Problem
              </button>
              <button
                onClick={async () => {
                  await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/deleteproblem`, { withCredentials: true });
                  navigate('/dashboard');
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
                Delete Problem
              </button>
            </div>
          )}
        </div>

        {/* Problem Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Statement */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-400" />
                Problem Statement
              </h3>
              <p className="text-slate-300 leading-relaxed">{problem.problemstatement.statement}</p>
            </div>

            {/* Input/Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Input</h3>
                <p className="text-slate-300">{problem.problemstatement.input}</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Output</h3>
                <p className="text-slate-300">{problem.problemstatement.output}</p>
              </div>
            </div>

            {/* Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Example Input</h3>
                <pre className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 font-mono border border-slate-700/50 overflow-x-auto">{problem.problemstatement.exampleinput}</pre>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Example Output</h3>
                <pre className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 font-mono border border-slate-700/50 overflow-x-auto">{problem.problemstatement.exampleoutput}</pre>
              </div>
            </div>

            {/* Problem Link */}
            {problem.link && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Problem Link</h3>
                <a 
                  href={problem.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  {problem.link}
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleProblemReview} 
                  className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <Star className="h-4 w-4" />
                  Add Review
                </button>
                <button 
                  onClick={handleAddSolution} 
                  className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  Add Solution
                </button>
              </div>
            </div>

            {/* Problem Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Problem Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Solutions</span>
                  <span className="text-white font-semibold">{problem.solutions?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reviews</span>
                  <span className="text-white font-semibold">{problem.reviews?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Visibility</span>
                  <span className="text-white font-semibold capitalize">{problem.choice || 'Public'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
