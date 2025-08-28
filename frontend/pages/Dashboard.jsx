import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import UsersCard from '../components/usersCard';
import { Loader2, Plus, Code2, TrendingUp, Users, Zap } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
          withCredentials: true,
        });
        setProblems(response.data);
      } catch (error) {
        console.log(error);
      } finally {
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
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
              <Code2 className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Welcome to ZCoder</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Coding
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Dashboard</span>
            </h1>
            {/* <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Track your progress, explore problems, and connect with the coding community
            </p> */}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{problems.length}</h3>
              <p className="text-slate-400">Total Problems</p>
            </div> */}
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{problems.length}</h3>
              <p className="text-slate-400">Total Problems</p>
            </div>
            
            {/* <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">156</h3>
              <p className="text-slate-400">Active Users</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Problems Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Zap className="h-8 w-8 text-yellow-400" />
                    Dashboard Problems
                  </h2>
                  <p className="text-slate-400">Explore and solve coding challenges</p>
                </div>
                <button
                  className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => navigate('/addproblem')}
                >
                  <Plus className="h-5 w-5" />
                  Add Problem
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-slate-400">Loading problems...</p>
                  </div>
                </div>
              ) : problems.length > 0 ? (
                <div className="space-y-4">
                  {problems.map((problem) => (
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
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Code2 className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Problems Yet</h3>
                  <p className="text-slate-400 mb-6">Start your coding journey by adding your first problem</p>
                  <button
                    onClick={() => navigate('/addproblem')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                  >
                    Create Your First Problem
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Top Users Section */}
          <div className="lg:col-span-1">
            <UsersCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
