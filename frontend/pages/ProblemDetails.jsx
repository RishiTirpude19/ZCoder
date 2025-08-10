import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch , useSelector } from 'react-redux';


function ProblemDetail() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const currentUserId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}`, {
          withCredentials: true
        });
        setProblem(response.data.problem);
        setIsBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProblem();
  }, [problemId]);

  async function handleAddSolution() {
    navigate(`/problem/${problemId}/addsolution`);
  }

  async function handleProblemReview() {
    navigate(`/problem/${problemId}/addreview`);
  }

  async function handleSolution() {
    navigate(`/problem/${problemId}/solutions`);
  }

  async function handleBookmark() {
    try {
      if (isBookmarked) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/unbookmark/${problemId}`, {}, { withCredentials: true });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookmark/${problemId}`, {}, { withCredentials: true });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log(error);
    }
  }

  if (!problem) {
    return <div className="text-white text-center mt-10">Loading problem details...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="bg-white/20 backdrop-blur-md text-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 space-y-6">
      <button
                onClick={() => navigate(`/dashboard`)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition"
              > 
                ⬅ Back to Dashboard
              </button>
        <h1 className="text-3xl font-bold mb-4 text-center select-none">Problem Details</h1>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={handleSolution} className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition">
            Solutions ({problem.solutions.length})
          </button>
          <button onClick={() => navigate(`/problem/${problemId}/reviews`)} className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition">
            Reviews ({problem.reviews.length})
          </button>
          <button onClick={() => navigate(`/problem/${problemId}/discussion`)} className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition">
            Join Discussion
          </button>
        </div>

        {currentUserId === problem.user._id && (
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate(`/problem/${problemId}/updateproblem`)} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-medium transition">
              Update Problem
            </button>
            <button
              onClick={async () => {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/deleteproblem`, { withCredentials: true });
                navigate('/dashboard');
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Delete Problem
            </button>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-violet-100">Problem by: <i>@{problem.user.username}</i></p>
          <div>
            <h3 className="font-semibold">Title:</h3>
            <p>{problem.title}</p>
          </div>
          <div>
            <h3 className="font-semibold">Problem Statement:</h3>
            <p>{problem.problemstatement.statement}</p>
          </div>
          <div>
            <h3 className="font-semibold">Input:</h3>
            <p>{problem.problemstatement.input}</p>
          </div>
          <div>
            <h3 className="font-semibold">Output:</h3>
            <p>{problem.problemstatement.output}</p>
          </div>
          <div>
            <h3 className="font-semibold">Example Input:</h3>
            <pre className="bg-white/10 p-2 rounded text-sm">{problem.problemstatement.exampleinput}</pre>
          </div>
          <div>
            <h3 className="font-semibold">Example Output:</h3>
            <pre className="bg-white/10 p-2 rounded text-sm">{problem.problemstatement.exampleoutput}</pre>
          </div>
          <div>
            <h3 className="font-semibold">Link:</h3>
            <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-violet-200 underline hover:text-violet-100">
              {problem.link}
            </a>
          </div>
        </div>

        <hr className="border-white/30 my-4" />

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={handleProblemReview} className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition">
            Add Review
          </button>
          <button onClick={handleAddSolution} className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition">
            Add Solution
          </button>
          <button
            onClick={handleBookmark}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isBookmarked
                ? 'bg-pink-500 hover:bg-pink-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isBookmarked ? 'Remove from Bookmark' : 'Add to Bookmark'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
