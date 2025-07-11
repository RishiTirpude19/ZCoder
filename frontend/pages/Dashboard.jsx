import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import { Loader2 } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
          withCredentials: true,
        });
        setProblems(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProblems();
  }, []);

  const handleCardClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="bg-white/20 backdrop-blur-md w-full max-w-6xl rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-center sm:text-left mb-4 sm:mb-0 select-none cursor-default">Dashboard Problems</h1>
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300 select-none cursor-default"
            onClick={() => navigate('/addproblem')}
          >
            + Add Problem
          </button>
        </div>

        {problems.length > 0 ? (
  <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
    {problems.map((problem) => (
      <div
        key={problem._id}
        onClick={() => handleCardClick(problem._id)}
        className="cursor-pointer transform hover:scale-[1.02] transition-transform"
      >
        <ProblemCard
          user={problem.user.username}
          choice={""}
          title={problem.title}
          platform={problem.platform.name}
          rating={problem.platform.rating}
        />
      </div>
    ))}
  </div>
) : (
  <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
)}
      </div>
    </div> 
  );
}

export default Dashboard;
