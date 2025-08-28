import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowLeft, Loader2, Plus, User, Zap } from "lucide-react";

function MyProblems() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [problems, setProblems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myproblems`, {
          withCredentials: true,
        });
        setProblems(response.data.problems);
        setUser(response.data.username);
        setLoading(false);
      } catch (error) {
        setErr(error);
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const handleClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  if (err) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code2 className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Problems</h3>
          <p className="text-slate-400 mb-6">{err.message}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Back to Dashboard
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Code2 className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Problem Management</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">My Problems</span>
              </h1>
              <p className="text-slate-400">Manage and track your coding challenges</p>
            </div>
            
            <button
              onClick={() => navigate('/addproblem')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add Problem
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="h-8 w-8 text-blue-400" />
              {user ? `${user}'s Problems` : 'My Problems'}
            </h2>
            <p className="text-slate-400">
              {problems.length > 0 
                ? `You have ${problems.length} problem${problems.length > 1 ? 's' : ''} in your collection`
                : 'Start building your problem collection by adding your first coding challenge'
              }
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-slate-400">Loading your problems...</p>
              </div>
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code2 className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Problems Yet</h3>
              <p className="text-slate-400 mb-6">Start your coding journey by adding your first problem</p>
              <button
                onClick={() => navigate('/addproblem')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create Your First Problem
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem._id}
                  onClick={() => handleClick(problem._id)}
                  className="cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                >
                  <ProblemCard
                    user={user}
                    choice={problem.choice}
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

export default MyProblems;
