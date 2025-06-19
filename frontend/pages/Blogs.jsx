import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`, { withCredentials: true });
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6 text-white font-sans select-none cursor-default">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-6">

        {/* Compose Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => navigate("/addblog")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300 select-none cursor-default"
          >
            Compose
          </button>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center">All Blogs</h1>
        <hr className="w-24 border-white/30" />

        {/* Blog List */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <div
                key={blog._id}
                className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-5 hover:bg-white/30 transition"
              >
                <BlogCard
                  title={blog.title}
                  author={blog.author}
                  content={blog.content}
                  date={blog.createdAt}
                />
              </div>
            ))
          ) : (
            <p className="text-white/80 text-lg mt-10">No blogs found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;
