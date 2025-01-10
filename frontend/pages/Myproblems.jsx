import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import './MyProblems.css'; 
import { useNavigate } from 'react-router-dom';

function MyProblems() {
    const navigate = useNavigate();
    const [user , setUser] = useState("");
    const [problems, setProblems] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProblems() {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myproblems`, {
                    withCredentials: true,
                });
                setProblems(response.data.problems);
                setUser(response.data.username)
                setLoading(false);
            } catch (error) {
                setErr(error);
                setLoading(false);
            }
        }
        fetchProblems();
    }, []);

    const handleClick = (problemId)=>{
        navigate(`/problem/${problemId}`)
    }

    if (err) {
        return (
            <div>
                <h3>{err.message}</h3>
            </div>
        );
    }

    return (
        <div className="myproblems-page">
            <div className="myproblems-container">
                <h1>My Problems:</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : problems.length === 0 ? (
                    <p className="no-problems">No problems found.</p>
                ) : (
                    <ul className="problem-list">
                        {problems.map((problem, index) => (
                            <li key={index}>
                                <ProblemCard
                                    user={user}
                                    choice={problem.choice}
                                    title={problem.title}
                                    platform={problem.platform.name}
                                    rating={problem.platform.rating}
                                    onClick={() => handleClick(problem._id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MyProblems;
