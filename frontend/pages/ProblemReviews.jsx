import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Star, Trash2, MessageSquare } from "lucide-react";

function ProblemReviews() {
  const [reviews, setReviews] = useState([]);
  const currUser = useSelector((state) => state.user.user._id);
  const { problemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/reviews`,
          { withCredentials: true }
        );
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

  // Renders stars based on rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-slate-500'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/problem/${problemId}`)}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 
                         text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all 
                         duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problem
            </button>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 
                              rounded-full px-6 py-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Reviews</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Problem Reviews
                </span>
              </h1>
              <p className="text-slate-400">See what others think about this problem</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">Community Feedback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {reviews.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">No reviews found for this problem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 
                           rounded-2xl p-6 shadow-lg relative hover:shadow-xl transition"
              >
                {/* Username */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  @{review.user?.username || "Unknown"}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-slate-400">{review.rating}/5</span>
                </div>

                {/* Comment */}
                <p className="text-slate-300 text-sm leading-relaxed">
                  {review.comment}
                </p>

                {/* Delete button for current user's review */}
                {review.user?._id === currUser && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    title="Delete review"
                    className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-5 w-5" />
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
