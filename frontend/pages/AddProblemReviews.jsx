import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AddProblemReviews() {
  const navigate = useNavigate();
  const { problemId } = useParams();

  const [formData, setFormData] = useState({
    rating: 1,
    comment: '',
    problem: problemId,
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
        `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/addreview`,
        formData,
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      navigate(`/problem/${problemId}`);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6 text-white">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold select-none">Add a Review</h1>
          <button
            onClick={() => navigate(`/problem/${problemId}`)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition"
          >
            Back to Problem
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              required
            >
              <option value={1}>1 - Very Poor</option>
              <option value={2}>2 - Poor</option>
              <option value={3}>3 - Average</option>
              <option value={4}>4 - Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Comment</label>
            <textarea
              name="comment"
              rows={5}
              placeholder="Write your review here..."
              value={formData.comment}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          {error && <p className="text-sm text-red-200 mt-4 text-center">{error}</p>}
          {success && <p className="text-sm text-green-200 mt-4 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddProblemReviews;
