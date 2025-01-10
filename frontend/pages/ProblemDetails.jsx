import React, { useEffect, useState, useContext  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../components/UserContext.jsx"; 
import './ProblemDetails.css';

function ProblemDetail() {
    const navigate = useNavigate();
    const { problemId } = useParams();
    const {user} = useContext(UserContext);
    const [problem, setProblem] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false); 
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {   
        async function fetchProblem() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}`, {withCredentials: true});
                
                setProblem(response.data.problem);
                
                setIsBookmarked(response.data.isBookmarked); 
            } catch (error) {
                console.log(error);
            }
        }
        fetchProblem();
    }, [problemId]);

    async function handleAddSolution() {
        navigate(`/problem/${problemId}/addsolution`);
    }

    async function handelProblemReview() {
        navigate(`/problem/${problemId}/addreview`)
    }

    async function handleSolution() {
        navigate(`/problem/${problemId}/solutions`);
    }

    async function handleBookmark() {
        try {
            if (isBookmarked) {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/unbookmark/${problemId}`, {}, { withCredentials: true });
                console.log("Removed from bookmark:", response);
            } else {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookmark/${problemId}`, {}, { withCredentials: true });
                console.log("Added to bookmark:", response);
            }
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.log(error);
        }
    }

    if (!problem) {
        return <div>Loading problem details...</div>;
    }

    return (
        <>
            
            <div className='solutions'>
                <button onClick={handleSolution}>Solutions ({problem.solutions.length})</button>
            </div>
            <div className='reviews'>
                <button onClick={()=>{
                    navigate(`/problem/${problemId}/reviews`)
                }}>Reviews ({problem.reviews.length})</button>
            </div>
            {/* <div className='discussion'>
                <button onClick={()=>{
                    navigate(`/problem/${problemId}/discussion`)
                }}>Join Discussion ({problem.reviews.length})</button>
            </div> */}
            
            {currentUserId === problem.user._id ? (<>
            <div className='update'>
                <button onClick={()=>{
                    navigate(`/problem/${problemId}/updateproblem`)
                }}>Update Problem</button>
                </div>
                <div className='delete'>
                <button onClick={async () => {
                    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/deleteproblem`, { withCredentials: true });
                    console.log("Deleted");
                    navigate(`/dashboard`);
                }}>Delete Problem</button>
            </div>
            </>
                ) : (<></>) }
            
            <div className='problem-details'>
                <h3>Problem by: @<i>{problem.user.username}</i></h3>
                <h3>Title:</h3>
                <p>{problem.title}</p>
                <h3>Problem Statement:</h3>
                <p>{problem.problemstatement.statement}</p>
                <h3>Input:</h3>
                <p>{problem.problemstatement.input}</p>
                <h3>Output:</h3>
                <p>{problem.problemstatement.output}</p>
                <h3>Example Input:</h3>
                <pre>{problem.problemstatement.exampleinput}</pre>
                <h3>Example Output:</h3>
                <pre>{problem.problemstatement.exampleoutput}</pre>
                <h3>Link:</h3>
                <a href={problem.link} target="_blank" rel="noopener noreferrer">
                    {problem.link}
                </a>
                <hr />
                <div className='button-group'>
                    <button onClick={handelProblemReview}>Add Review</button>
                    <button onClick={handleAddSolution}>Add Solution</button>
                    <button onClick={()=>{
                        navigate(`/problem/${problemId}/discussion`);
                    }}>Join Discussion</button>
                    <button 
                        className={`bookmark-button ${isBookmarked ? 'bookmarked' : 'unbookmarked'}`} 
                        onClick={handleBookmark}
                    >
                        {isBookmarked ? 'Remove from Bookmark' : 'Add to Bookmark'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default ProblemDetail;
