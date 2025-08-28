import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, ArrowLeft, Search, PenTool } from 'lucide-react';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`, { withCredentials: true });
        console.log("Blogs response:", response.data);
        setBlogs(Array.isArray(response.data) ? response.data : response.data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Knowledge Sharing</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Blogs</span>
              </h1>
              <p className="text-slate-400">Discover insights and share your knowledge with the community</p>
            </div>
            
            <button
              onClick={() => navigate("/addblog")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Compose
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search blogs by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 transition-all border border-slate-600/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{filteredBlogs.length}</div>
                  <div className="text-sm text-slate-400">Total Blogs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{blogs.length}</div>
                  <div className="text-sm text-slate-400">All Blogs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <PenTool className="h-8 w-8 text-blue-400" />
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Blogs'}
            </h2>
            <p className="text-slate-400">
              {searchQuery 
                ? `Found ${filteredBlogs.length} blogs matching your search`
                : 'Explore the latest insights and knowledge shared by our community'
              }
            </p>
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map(blog => (
                <div
                  key={blog._id}
                  className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <BlogCard
                    title={blog.title}
                    author={blog.author}
                    content={blog.content}
                    date={blog.createdAt}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all blogs'
                  : 'Be the first to share your knowledge with the community'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/addblog')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Blog
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;
