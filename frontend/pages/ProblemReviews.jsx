import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

function ProblemReviews() {
  const [reviews, setReviews] = useState([]);
  const currUser = sessionStorage.getItem("userId");
  const { problemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/reviews`, {
          withCredentials: true,
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
  }, [problemId]);

  async function handleDelete(reviewId) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/reviews/${reviewId}`,
        { withCredentials: true }
      );
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0ABFC] via-[#C084FC] to-[#818CF8] p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
        <button
          onClick={() => navigate(`/problem/${problemId}`)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
        >
          ⬅ Back to Problem
        </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">Problem Reviews</h1>

        {reviews.length === 0 ? (
          <p className="text-center text-lg mt-12 text-white/90">No reviews found for this problem.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg space-y-3 relative"
              >
                <h3 className="text-xl font-semibold">@{review.user?.username || "Unknown"}</h3>
                <p className="text-sm text-violet-200 font-medium">Rating: {review.rating}/5</p>
                <p className="text-sm text-white/90">{review.comment}</p>

                {review.user?._id === currUser && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    title="Delete review"
                    className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemReviews;
