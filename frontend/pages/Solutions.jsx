import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SolutionCard from '../components/SolutionCard';
import { ArrowLeft, Code2, Lightbulb, Loader2, Plus } from "lucide-react";

function Solutions() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState({});
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { problemId } = useParams();

  useEffect(() => {
    async function fetchSolutions() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions`,
          { withCredentials: true }
        );
        setSolutions(response.data.solutions);
        setProblem(response.data.problem);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, []);

  const handleOnClick = (solutionId) => {
    navigate(`/problem/${problemId}/solutions/${solutionId}`);
  };

  const handleBTP = () => {
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
              onClick={handleBTP}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problem
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Code2 className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Problem Solutions</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Solutions</span>
              </h1>
              <p className="text-slate-400">Explore different approaches to solve this problem</p>
            </div>
            
            <button
              onClick={() => navigate(`/problem/${problemId}/addsolution`)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add Solution
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-yellow-400" />
              {problem.title || 'Problem Title'}
            </h2>
            <p className="text-slate-400 mb-6">
              {problem.title ? `Solutions for: ${problem.title}` : 'Loading problem details...'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-slate-400">Loading solutions...</p>
              </div>
            </div>
          ) : solutions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code2 className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Solutions Yet</h3>
              <p className="text-slate-400 mb-6">Be the first to share your solution to this problem</p>
              <button
                onClick={() => navigate(`/problem/${problemId}/addsolution`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add Your Solution
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Code2 className="h-6 w-6 text-blue-400" />
                  {solutions.length} Solution{solutions.length > 1 ? 's' : ''} Found
                </h3>
                <p className="text-slate-400">Click on any solution to view the details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((solution) => (
                  <div
                    key={solution._id}
                    className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                    onClick={() => handleOnClick(solution._id)}
                  >
                    <SolutionCard approach={solution.approach} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Solutions;
