  import React, { useState } from 'react';
  import axios from 'axios';
  import { useNavigate, useParams } from 'react-router-dom';

  function AddSolution() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      approach: '',
      description: '',
      code: '',
      problem: problemId,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/addsolution`,
          formData,
          { withCredentials: true }
        );
        console.log(response.data);
        setSuccess(response.data.message);
        navigate(`/problem/${problemId}`);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <button
                onClick={() => navigate(`/problem/${problemId}`)}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-white/30 transition"
              >
                ⬅ Back to Problem
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-white">
              <h1 className="text-3xl font-bold mb-8 text-center">Add a Solution</h1>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Approach + Description */}
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Approach</label>
                    <textarea
                      name="approach"
                      rows={5}
                      value={formData.approach}
                      onChange={handleChange}
                      required
                      placeholder="Describe your approach here..."
                      className="w-full p-4 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                      name="description"
                      rows={8}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Explain the solution in detail..."
                      className="w-full p-4 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                  </div>
                </div>

                {/* Right Column - Code */}
                <div>
                  <label className="block mb-2 font-medium">Code</label>
                  <textarea
                    name="code"
                    rows={18}
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="Paste your code here..."
                    className="w-full p-4 font-mono text-sm rounded-lg bg-black/80 text-green-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                {/* Full Width Submit Button */}
                <div className="lg:col-span-2 flex justify-center mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-1/3 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Solution'}
                  </button>
                </div>

                {error && (
                  <div className="lg:col-span-2 text-center text-red-200">{error}</div>
                )}
                {success && (
                  <div className="lg:col-span-2 text-center text-green-200">{success}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  export default AddSolution;
