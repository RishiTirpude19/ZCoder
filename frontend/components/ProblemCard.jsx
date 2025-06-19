import React from 'react';

function ProblemCard({ user, choice, title, platform, rating, onClick }) {
    return (
        <div
            onClick={onClick}
            className="w-full bg-white/1 backdrop-blur-md rounded-2xl shadow-xl p-6 text-white transition-transform hover:scale-[1.02] cursor-pointer"
        >
            {choice && (
                <p className="text-xs uppercase font-semibold text-violet-200 mb-2 tracking-wide">
                    {choice}
                </p>
            )}
            <h2 className="text-xl font-semibold mb-1 text-white">{title}</h2>
            <h3 className="text-sm text-violet-100 mb-3">By: {user}</h3>
            <div className="text-sm text-white space-y-1">
                <p><span className="font-medium text-white">Platform:</span> {platform}</p>
                <p><span className="font-medium text-white">Rating:</span> {rating}</p>
            </div>
        </div>
    );
}

export default ProblemCard;
