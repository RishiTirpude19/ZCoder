import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProblemCard from "../components/ProblemCard.jsx";
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";

function BookMarkProblems() {
  const [loading, setLoading] = useState(false);
  const [bookmarkProblems, setBookMarkProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bookmarkedproblems`, {
          withCredentials: true,
        });
        setBookMarkProblems(response.data.problems);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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
        <h1 className="text-4xl font-semibold text-center mb-8 select-none">
          Bookmarked Problems
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
</div>
        ) : bookmarkProblems.length === 0 ? (
          <div className="text-center text-white/90 italic mt-20">
            No Bookmarked Problems Yet...
          </div>
        ) : (
          <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
            {bookmarkProblems.map((problem) => (
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
        )}
      </div>
    </div>
  );
}

export default BookMarkProblems;
