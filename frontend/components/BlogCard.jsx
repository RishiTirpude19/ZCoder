import React from 'react';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';

function BlogCard({ title, author, content, date }) {
  return (
    <div className="blog-card bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="blog-title text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
            {title}
          </h2>
          
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-400" />
              <span>{new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          
          <p className="blog-content text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {content}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-slate-400">Blog Post</span>
        </div>
        
        <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
          <span className="text-sm font-medium">Read More</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
