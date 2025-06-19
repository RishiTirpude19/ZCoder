import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HireCollaboraters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchuser?query=${searchQuery}`, {
        withCredentials: true,
      });
      setSearchResults(response.data);
      setSearchQuery("");
    } catch (error) {
      console.error(error);
      alert('Error fetching search results.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-6 text-white font-sans select-none cursor-default">
      <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6">

        {/* Header */}
        <h1 className="text-3xl font-semibold text-center select-none">Hire Collaborators</h1>
        <hr className="border-white/30" />

        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by username or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            onClick={handleSearch}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition"
          >
            Search
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((collaborator) => (
              <div
                key={collaborator._id}
                onClick={() => navigate(`/profile/${collaborator._id}`)}
                className="cursor-pointer bg-white/30 hover:bg-white/40 transition p-4 rounded-lg shadow-md"
              >
                <p className="text-lg font-medium">{collaborator.username}</p>
              </div>
            ))
          ) : (
            <p className="text-white/80 text-center">No collaborators found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HireCollaboraters;
