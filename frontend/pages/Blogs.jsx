import React, { useEffect, useState } from 'react'
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';
import "./Blog.css"
function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get("http://localhost:8080/blogs", { withCredentials: true });
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <>
    <div className='btp'>
      <button onClick={()=>{
        navigate("/addblog")
      }}>Compose</button>
    </div>
    <div className="blogs-container">
      <h1>All Blogs</h1>
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <BlogCard 
            key={blog._id} 
            title={blog.title} 
            author={blog.author} 
            content={blog.content} 
            date={blog.createdAt} 
          />
        ))
      ) : (
        <p>No blogs found</p>
      )}
    </div>
    </>
    
  );
}

export default Blogs;
