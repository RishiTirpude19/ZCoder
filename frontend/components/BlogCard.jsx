import React from 'react';
import './BlogCard.css'; 

function BlogCard({ title, author, content, date }) {
  return (
    <div className="blog-card">
      <h2 className="blog-title">{title}</h2>
      <p className="blog-author">By: {author}</p>
      <p className="blog-content">{content}</p>
      <p className="blog-date">{new Date(date).toLocaleDateString()}</p>
    </div>
  );
}

export default BlogCard;
