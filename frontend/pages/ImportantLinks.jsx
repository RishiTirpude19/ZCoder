import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

function ImportantLinks() {
  const [impLinks, setImpLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImpLinks() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/implinks`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data.links)) {
          setImpLinks(response.data.links);
        }
      } catch (error) {
        setImpLinks([]);
        console.log(error);
      }
    }
    fetchImpLinks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/implinks/${id}`, {
        withCredentials: true,
      });
      setImpLinks((prev) => prev.filter((link) => link._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const staticLinks = [
    { title: "Codeforces ProblemSet", url: "https://codeforces.com/problemset" },
    { title: "LeetCode ProblemSet", url: "https://leetcode.com/problemset/" },
    { title: "Atcoder ProblemSet", url: "https://atcoder.jp/home" },
    { title: "CSES ProblemSet", url: "https://cses.fi/problemset/" },
    { title: "Take You Forward", url: "https://takeuforward.org/" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] px-6 py-12 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white select-none cursor-default drop-shadow-md">Important Links</h1>
          <button
            onClick={() => navigate("/importantlink/addlink")}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
          >
            + Add Link
          </button>
        </div>

        {/* Static Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {staticLinks.map(({ title, url }) => (
            <div
              key={url}
              className="bg-white/10 rounded-xl p-5 text-white backdrop-blur-md shadow-md hover:scale-[1.02] transition-transform border border-white/10"
            >
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 underline break-all hover:text-violet-200"
              >
                {url}
              </a>
            </div>
          ))}
        </div>

        {/* User Links */}
        {impLinks.length > 0 && (
          <>
            <h2 className="text-2xl text-white font-semibold mb-6 border-b border-white/20 pb-2">Your Added Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {impLinks.map((link) => (
                <div
                  key={link._id}
                  className="relative bg-white/10 rounded-xl p-5 text-white backdrop-blur-md shadow-lg hover:scale-[1.02] transition-transform border border-white/10"
                >
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="absolute top-3 right-3 text-red-300 hover:text-red-500 transition"
                    title="Delete link"
                  >
                    <FaTrash size={16} />
                  </button>
                  <h4 className="font-semibold text-lg mb-2">{link.name}</h4>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 underline break-all hover:text-violet-200"
                  >
                    {link.link}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImportantLinks;
