import React from 'react';
import { Code2, User, Star, ExternalLink } from 'lucide-react';

function ProblemCard({ user, choice, title, platform, rating, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-white transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600/50 hover:shadow-2xl cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1"
        >
            {/* Header with choice badge */}
            {choice && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                        {choice}
                    </span>
                </div>
            )}

            {/* Problem Title */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
                    {title}
                </h2>
                <div className="flex items-center gap-2 text-slate-400">
                    <User className="h-4 w-4" />
                    <span className="text-sm">By {user}</span>
                </div>
            </div>

            {/* Platform and Rating Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
                        <Code2 className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-300">{platform}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 px-3 py-2 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-yellow-400">{rating}</span>
                </div>
            </div>

            {/* Hover effect indicator */}
            <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-slate-500">Click to view details</span>
                <ExternalLink className="h-4 w-4 text-blue-400" />
            </div>
        </div>
    );
}

export default ProblemCard;
