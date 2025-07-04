import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    problemstatement: {
      statement: '',
      input: '',
      output: '',
      exampleinput: '',
      exampleoutput: '',
    },
    choice: 'public',
    platform: {
      name: '',
      rating: '',
    },
    link: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}`, {
          withCredentials: true,
        });
        setFormData(response.data.problem);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemDetails();
  }, [problemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setFormData(prev => ({
        ...prev,
        [mainKey]: {
          ...prev[mainKey],
          [subKey]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/updateproblem`,
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
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold select-none">Update Problem</h1>
          <button
            onClick={() => navigate(`/problem/${problemId}`)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition"
          >
            Back to Problem
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block mb-1">Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Problem Statement</label>
            <textarea
              name="problemstatement.statement"
              rows={6}
              value={formData.problemstatement.statement}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Input</label>
              <textarea
                name="problemstatement.input"
                rows={4}
                value={formData.problemstatement.input}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block mb-1">Output</label>
              <textarea
                name="problemstatement.output"
                rows={4}
                value={formData.problemstatement.output}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Example Input</label>
              <textarea
                name="problemstatement.exampleinput"
                rows={4}
                value={formData.problemstatement.exampleinput}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block mb-1">Example Output</label>
              <textarea
                name="problemstatement.exampleoutput"
                rows={4}
                value={formData.problemstatement.exampleoutput}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Choice</label>
              <select
                name="choice"
                value={formData.choice}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Platform Name</label>
                <input
                  type="text"
                  name="platform.name"
                  value={formData.platform.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="block mb-1">Rating</label>
                <input
                  type="number"
                  name="platform.rating"
                  value={formData.platform.rating}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/80 text-black focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Problem'}
          </button>

          {error && <p className="text-sm text-red-200 mt-4 text-center">{error}</p>}
          {success && <p className="text-sm text-green-200 mt-4 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default UpdateProblem;
