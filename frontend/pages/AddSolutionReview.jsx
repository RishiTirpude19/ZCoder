import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare, Send, Loader2 } from "lucide-react";

function AddSolutionReview() {
  const navigate = useNavigate();
  const { problemId, solutionId } = useParams();
  const [formData, setFormData] = useState({
    rating: 1,
    comment: '',
    solution: solutionId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions/${solutionId}/addreview`,
        formData,
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      navigate(`/problem/${problemId}/solutions/${solutionId}`);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-slate-400'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
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
              onClick={() => navigate(`/problem/${problemId}/solutions/${solutionId}`)}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Solution
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Add Review</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Solution Review</span>
              </h1>
              <p className="text-slate-400">Share your feedback and rating for this solution</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">Rate & Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Rating Section */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <label className="block mb-4 font-semibold text-white text-lg">Rating</label>
              <div className="flex items-center justify-center gap-2 mb-4">
                {renderStars(formData.rating)}
              </div>
              <div className="text-center">
                <p className="text-slate-300 text-sm">
                  {formData.rating === 1 && 'Very Poor'}
                  {formData.rating === 2 && 'Poor'}
                  {formData.rating === 3 && 'Average'}
                  {formData.rating === 4 && 'Good'}
                  {formData.rating === 5 && 'Excellent'}
                </p>
              </div>
              <input
                type="hidden"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </div>

            {/* Comment Section */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <label className="block mb-4 font-semibold text-white text-lg">Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={6}
                required
                placeholder="Write your detailed review here... Share what you liked, what could be improved, or any suggestions..."
                className="w-full p-4 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/70 transition-all border border-slate-600/50 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Review
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                <p className="text-green-200">{success}</p>
              </div>
            )}
          </form>

          {/* Tips */}
          <div className="mt-8 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
            <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Review Tips
            </h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Be constructive and specific in your feedback</li>
              <li>• Mention what you found helpful or innovative</li>
              <li>• Suggest improvements if applicable</li>
              <li>• Keep the tone respectful and professional</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSolutionReview;
