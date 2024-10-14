import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await axios.get('http://localhost:8080/dashboard', {
          withCredentials: true,
        });
        setProblems(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProblems();
  }, []);

  // Function to handle card click and navigate
  const handleCardClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className="dashboard-page">
      <button
        className="add-problem-button"
        onClick={() => {
          navigate('/addproblem');
        }}
      >
        Add Problem
      </button>
      <div className="problems-container">
        <h1>Dashboard Problems:</h1>
        {problems.length > 0 ? (
          <ul className="problem-list">
            {problems.map((problem) => (
              <li key={problem._id}>
                <ProblemCard
                  user={problem.user.username}
                  choice={""}
                  title={problem.title}
                  platform={problem.platform.name}
                  rating={problem.platform.rating}
                  onClick={() => handleCardClick(problem._id)} // Pass the click handler
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-problems">No Problems yet...</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
