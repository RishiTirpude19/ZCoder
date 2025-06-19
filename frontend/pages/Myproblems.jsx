import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import { useNavigate } from 'react-router-dom';

function MyProblems() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [problems, setProblems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myproblems`, {
          withCredentials: true,
        });
        setProblems(response.data.problems);
        setUser(response.data.username);
        setLoading(false);
      } catch (error) {
        setErr(error);
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const handleClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  if (err) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] text-white">
        <h3 className="text-xl font-semibold">Error: {err.message}</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="bg-white/20 backdrop-blur-md w-full max-w-6xl rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-4xl font-semibold text-center mb-8 select-none">My Problems</h1>

        {loading ? (
          <div className="text-center text-white/90 italic">Loading...</div>
        ) : problems.length === 0 ? (
          <div className="text-center text-white/90 italic mt-20">No problems found.</div>
        ) : (
          <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
            {problems.map((problem) => (
              <div
                key={problem._id}
                onClick={() => handleClick(problem._id)}
                className="cursor-pointer transform hover:scale-[1.02] transition-transform"
              >
                <ProblemCard
                  user={user}
                  choice={problem.choice}
                  title={problem.title}
                  platform={problem.platform.name}
                  rating={problem.platform.rating}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProblems;
