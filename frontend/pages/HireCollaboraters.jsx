import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ArrowLeft, UserPlus, Building2, Mail, MapPin } from 'lucide-react';

function HireCollaboraters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchuser?query=${searchQuery}`, {
        withCredentials: true,
      });
      setSearchResults(response.data);
      setSearchQuery("");
    } catch (error) {
      console.error(error);
      alert('Error fetching search results.');
    } finally {
      setIsSearching(false);
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Team Building</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Hire Collaborators</span>
              </h1>
              <p className="text-slate-400">Find the perfect team members for your coding projects</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <UserPlus className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Find Talent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Search Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Find Your Perfect Collaborator</h2>
            <p className="text-slate-400">Search by username or email to discover talented developers</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 transition-all border border-slate-600/50"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-400" />
                Search Results
              </h3>
              <p className="text-slate-400">Found {searchResults.length} potential collaborators</p>
            </div>

            <div className="space-y-4">
              {searchResults.map((collaborator) => (
                <div
                  key={collaborator._id}
                  onClick={() => navigate(`/profile/${collaborator._id}`)}
                  className="cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {collaborator.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {collaborator.username || 'Unknown User'}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          {collaborator.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {collaborator.email}
                            </div>
                          )}
                          {collaborator.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {collaborator.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-300">Available</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-600/50">
                    <p className="text-slate-300 text-sm">
                      Click to view profile and connect with this collaborator
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {searchResults.length === 0 && !isSearching && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Find Collaborators?</h3>
            <p className="text-slate-400 mb-6">
              Use the search above to find developers by username or email address
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Search className="h-4 w-4" />
              <span className="text-sm">Enter a search term to get started</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HireCollaboraters;
