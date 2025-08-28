import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link, Plus, ArrowLeft, ExternalLink, Trash2, Bookmark, Globe, Code2, Star } from "lucide-react";

function ImportantLinks() {
  const [impLinks, setImpLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImpLinks() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/implinks`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data.links)) {
          setImpLinks(response.data.links);
        }
      } catch (error) {
        setImpLinks([]);
        console.log(error);
      }
    }
    fetchImpLinks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/implinks/${id}`, {
        withCredentials: true,
      });
      setImpLinks((prev) => prev.filter((link) => link._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const staticLinks = [
    { title: "Codeforces ProblemSet", url: "https://codeforces.com/problemset", icon: Code2, color: "text-blue-400" },
    { title: "LeetCode ProblemSet", url: "https://leetcode.com/problemset/", icon: Star, color: "text-yellow-400" },
    { title: "Atcoder ProblemSet", url: "https://atcoder.jp/home", icon: Globe, color: "text-green-400" },
    { title: "CSES ProblemSet", url: "https://cses.fi/problemset/", icon: Bookmark, color: "text-purple-400" },
    { title: "Take You Forward", url: "https://takeuforward.org/", icon: Link, color: "text-cyan-400" },
  ];

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
                <span className="text-blue-400 font-medium">Resource Hub</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Important Links</span>
              </h1>
              <p className="text-slate-400">Essential resources and bookmarks for your coding journey</p>
            </div>
            
            <button
              onClick={() => navigate("/importantlink/addlink")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add Link
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        
        {/* Static Links */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              Essential Resources
            </h2>
            <p className="text-slate-400">Curated collection of the best coding platforms and resources</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticLinks.map(({ title, url, icon: Icon, color }) => (
              <div
                key={url}
                className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors">
                      {title}
                    </h3>
                  </div>
                </div>
                
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-blue-400 transition-colors break-all flex items-center gap-2 group/link"
                >
                  <span className="text-sm">{url}</span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* User Links */}
        {impLinks.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Bookmark className="h-6 w-6 text-green-400" />
                Your Added Links
              </h2>
              <p className="text-slate-400">Personal bookmarks and resources you've saved</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {impLinks.map((link) => (
                <div
                  key={link._id}
                  className="relative bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
                >
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/20 rounded-lg"
                    title="Delete link"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-white text-lg group-hover:text-green-300 transition-colors mb-2">
                      {link.name}
                    </h4>
                  </div>
                  
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-green-400 transition-colors break-all flex items-center gap-2 group/link"
                  >
                    <span className="text-sm">{link.link}</span>
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No User Links State */}
        {impLinks.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Personal Links Yet</h3>
            <p className="text-slate-400 mb-6">
              Start building your resource collection by adding useful links
            </p>
            <button
              onClick={() => navigate("/importantlink/addlink")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Your First Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportantLinks;
