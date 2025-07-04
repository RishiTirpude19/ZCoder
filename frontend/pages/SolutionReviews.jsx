import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SolutionReviews() {
  const [reviews, setReviews] = useState([]);
  const { problemId, solutionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions/${solutionId}/reviews`,
          { withCredentials: true }
        );
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
        <button
          onClick={() => navigate(`/problem/${problemId}`)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
        >
          ⬅ Back to Problem
        </button>
        </div>

        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8 text-center">
          <h1 className="text-3xl font-bold">Solution Reviews</h1>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white/30 backdrop-blur-md p-5 rounded-xl shadow-lg space-y-3"
              >
                <h3 className="font-semibold">
                  👤 @{review.user.username}
                </h3>
                <p className="text-yellow-300 font-medium">⭐ Rating: {review.rating}/5</p>
                <p className="text-white/90">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2 text-white/80">No reviews found for this solution.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SolutionReviews;
