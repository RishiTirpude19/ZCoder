import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProblemCard from "../components/ProblemCard.jsx";
import { useNavigate } from 'react-router-dom';
import "./BookMarkProblems.css"

function BookMarkProblems() {
  const [loading, setLoading] = useState(false);
  const [bookmarkProblems, setBookMarkProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/bookmarkedproblems`, { withCredentials: true });
        setLoading(false);
        console.log(response.data.problems);
        setBookMarkProblems(response.data.problems);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProblems();
  }, []);

  const handleCardClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  if (bookmarkProblems.length === 0) {
    return (
      <div className="bookmark-page">
        <div className="no-bookmarks">
          No Bookmarked Problems Yet...
        </div>
      </div>
    );
  }

  return (
    <div className="bookmark-page">
      <div className="problems-container">
        <h1>Bookmarked Problems:</h1>
        <ul className="problem-list">
          {bookmarkProblems.map((problem) => (
            <li key={problem._id}>
              <ProblemCard
                user={problem.user.username}
                choice={""}
                title={problem.title}
                platform={problem.platform.name}
                rating={problem.platform.rating}
                onClick={() => handleCardClick(problem._id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookMarkProblems;
