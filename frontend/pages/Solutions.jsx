import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SolutionCard from '../components/SolutionCard';

function Solutions() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState({});
  const [solutions, setSolutions] = useState([]);
  const { problemId } = useParams();

  useEffect(() => {
    async function fetchSolutions() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions`,
          { withCredentials: true }
        );
        setSolutions(response.data.solutions);
        setProblem(response.data.problem);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSolutions();
  }, []);

  const handleOnClick = (solutionId) => {
    navigate(`/problem/${problemId}/solutions/${solutionId}`);
  };

  const handleBTP = () => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="max-w-6xl mx-auto text-white">
        <div className="mb-6">
          <button
            onClick={handleBTP}
            className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg hover:bg-white/30 transition"
          >
            ⬅ Back to Problem
          </button>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-4">Problem Title</h1>
          <p className="text-lg font-medium mb-8 text-white/90">{problem.title}</p>

          <h2 className="text-2xl font-semibold mb-4">Solutions</h2>

          {solutions.length === 0 ? (
            <p className="text-white/70 italic">No solutions yet...</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solutions.map((solution) => (
                <li
                  key={solution._id}
                  className="bg-black/50 hover:bg-black/60 p-6 rounded-xl cursor-pointer transition"
                  onClick={() => handleOnClick(solution._id)}
                >
                  <SolutionCard approach={solution.approach} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Solutions;
