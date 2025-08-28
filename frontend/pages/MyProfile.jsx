import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, Mail, Code2, Star, Github, Globe, Bookmark, Briefcase, ArrowLeft, Loader2, Crown, Users, Edit3, Plus } from "lucide-react";

function MyProfile() {
  const userId = useSelector((state) => state.user.user)._id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}`, { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Profile Not Found</h3>
          <p className="text-slate-400 mb-6">Unable to load your profile</p>
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
                <User className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">My Profile</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{user.username}'s Profile</span>
              </h1>
              <p className="text-slate-400">Manage your personal information and preferences</p>
            </div>
            
            <div className="flex items-center gap-4">
              {user.collaborator && (
                <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg border border-yellow-500/30">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm">Collaborator</span>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/myprofile/${userId}/updateprofile`)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Update Profile
                </button>
                <button
                  onClick={() => navigate(`/${user._id}/collaborator`)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Invite Collaborator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                {user.collaborator && (
                  <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-full border border-yellow-500/30">
                    <Crown className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">Collaborator</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>

                {user.favlanguage && (
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Code2 className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-slate-400">Favorite Language</p>
                      <p className="text-white font-medium">{user.favlanguage}</p>
                    </div>
                  </div>
                )}

                {user.rating && (
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-slate-400">Rating</p>
                      <p className="text-white font-medium">{user.rating}</p>
                    </div>
                  </div>
                )}

                {user.platform && (
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-slate-400">Platform</p>
                      <p className="text-white font-medium">{user.platform}</p>
                    </div>
                  </div>
                )}

                {user.gitHub && (
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Github className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-slate-400">GitHub</p>
                      <a 
                        href={user.gitHub} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                      >
                        {user.gitHub}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Skills & Projects */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              
              {/* Skills Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Code2 className="h-6 w-6 text-blue-400" />
                  Skills
                </h3>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 mb-4">No skills listed yet</p>
                    <button
                      onClick={() => navigate(`/myprofile/${userId}/updateprofile`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add Skills
                    </button>
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-green-400" />
                  Projects
                </h3>
                {user.projectslinks && user.projectslinks.length > 0 ? (
                  <div className="space-y-3">
                    {user.projectslinks.map((link, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors break-all flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 mb-4">No projects linked yet</p>
                    <button
                      onClick={() => navigate(`/myprofile/${userId}/updateprofile`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add Projects
                    </button>
                  </div>
                )}
              </div>

              {/* Bookmarked Problems Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Bookmark className="h-6 w-6 text-yellow-400" />
                  Bookmarked Problems
                </h3>
                {user.otherBookMarkedProblems && user.otherBookMarkedProblems.length > 0 ? (
                  <div className="space-y-2">
                    {user.otherBookMarkedProblems.map((problem) => (
                      <div key={problem._id} className="p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-white font-medium">{problem.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 mb-4">No bookmarked problems yet</p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Explore Problems
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
