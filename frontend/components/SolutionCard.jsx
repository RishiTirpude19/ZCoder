import React from 'react';

function SolutionCard({ approach, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 hover:bg-white/20 active:scale-[0.98] transition transform backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 cursor-pointer text-white space-y-2"
    >
      <h2 className="text-xl font-bold tracking-wide text-white/90">Approach Overview</h2>
      <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
        {approach}
      </p>
      <div className="pt-2 text-violet-300 text-sm font-medium underline-offset-2 hover:underline">
        <h5>View Full Solution →</h5>
      </div>
    </div>
  );
}

export default SolutionCard;
