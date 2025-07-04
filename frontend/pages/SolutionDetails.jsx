import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function SolutionDetails() {
  const navigate = useNavigate();
  const { solutionId, problemId } = useParams();
  const [solution, setSolution] = useState(null);

  useEffect(() => {
    async function fetchSolution() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions/${solutionId}`,
          { withCredentials: true }
        );
        setSolution(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSolution();
  }, [solutionId, problemId]);

  if (!solution) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] text-white text-xl">
        Loading solution details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => navigate(`/problem/${problemId}/solutions`)}
            className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-white hover:bg-white/30 transition"
          >
            ⬅ Back to Solutions
          </button>
          <button
            onClick={() => navigate(`/problem/${problemId}/solutions/${solutionId}/reviews`)}
            className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-white hover:bg-white/30 transition"
          >
            View Reviews ({solution.reviews.length})
          </button>
          <button
            onClick={() => navigate(`/problem/${problemId}/solutions/${solutionId}/updatesolution`)}
            className="bg-yellow-400/90 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition"
          >
            ✏️ Update Solution
          </button>
          <button
            onClick={async () => {
              await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions/${solutionId}/deletesolution`,
                { withCredentials: true }
              );
              navigate(`/problem/${problemId}/solutions`);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            ❌ Delete
          </button>
        </div>

        
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Solution by{' '}
            <span className="italic text-white/80">
              @{solution.user ? solution.user.username : 'Unknown User'}
            </span>
          </h2>

          <div>
            <h3 className="text-lg font-semibold mb-1">🧠 Approach</h3>
            <p className="bg-white/10 p-4 rounded-lg">{solution.approach}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">📝 Description</h3>
            <p className="bg-white/10 p-4 rounded-lg">{solution.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">💻 Code</h3>
            <pre className="bg-black/80 p-4 rounded-lg text-green-300 font-mono overflow-x-auto">
              <code>{solution.code}</code>
            </pre>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() =>
                navigate(`/problem/${problemId}/solutions/${solutionId}/addreview`)
              }
              className="bg-violet-600 hover:bg-violet-700 px-6 py-3 text-white rounded-lg font-semibold transition"
            >
              ➕ Add Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionDetails;
