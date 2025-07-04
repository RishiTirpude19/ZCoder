import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate(`/problem/${problemId}/solutions/${solutionId}`)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
          >
            ⬅ Back to Solution
          </button>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Add a Review for the Solution</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value={1}>1 - Very Poor</option>
                <option value={2}>2 - Poor</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Write your review here..."
                className="w-full p-4 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/3 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            {error && <div className="text-red-200 text-center">{error}</div>}
            {success && <div className="text-green-200 text-center">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSolutionReview;
