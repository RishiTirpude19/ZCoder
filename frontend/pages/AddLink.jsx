import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddLink() {
  const [data, setData] = useState({
    name: '',
    link: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
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
        `${import.meta.env.VITE_BACKEND_URL}/implinks`,
        data,
        { withCredentials: true }
      );
      setSuccess('Link added successfully!');
      navigate('/importantlinks');
    } catch (error) {
      setError('Failed to add Link');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/importantlinks')}
              className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition"
            >
              ⬅ Back
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-white">
            <h1 className="text-3xl font-bold mb-8 text-center">Add a Link</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter a name for the link"
                  className="w-full p-4 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Link</label>
                <input
                  type="text"
                  name="link"
                  value={data.link}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com"
                  className="w-full p-4 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-1/3 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Adding Link...' : 'Add Link'}
                </button>
              </div>

              {/* Feedback */}
              {error && <div className="text-red-200 text-center">{error}</div>}
              {success && <div className="text-green-200 text-center">{success}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddLink;
