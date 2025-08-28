import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProblemCard from "../components/ProblemCard.jsx";
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowLeft, Loader2, Code2, Star } from "lucide-react";

function BookMarkProblems() {
  const [loading, setLoading] = useState(false);
  const [bookmarkProblems, setBookMarkProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bookmarkedproblems`, {
          withCredentials: true,
        });
        setBookMarkProblems(response.data.problems);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const handleCardClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Bookmark className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Saved Problems</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Bookmarked Problems</span>
              </h1>
              <p className="text-slate-400">Your collection of saved coding challenges</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">{bookmarkProblems.length} saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Bookmark className="h-8 w-8 text-blue-400" />
              Your Saved Problems
            </h2>
            <p className="text-slate-400">
              {bookmarkProblems.length > 0 
                ? `You have ${bookmarkProblems.length} bookmarked problem${bookmarkProblems.length > 1 ? 's' : ''}`
                : 'Start bookmarking problems to build your collection'
              }
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-slate-400">Loading bookmarked problems...</p>
              </div>
            </div>
          ) : bookmarkProblems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Bookmarked Problems Yet</h3>
              <p className="text-slate-400 mb-6">Start exploring problems and bookmark the ones you want to solve later</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
              >
                <Code2 className="h-4 w-4" />
                Explore Problems
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkProblems.map((problem) => (
                <div
                  key={problem._id}
                  onClick={() => handleCardClick(problem._id)}
                  className="cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                >
                  <ProblemCard
                    user={problem.user.username}
                    choice={""}
                    title={problem.title}
                    platform={problem.platform.name}
                    rating={problem.platform.rating}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookMarkProblems;
