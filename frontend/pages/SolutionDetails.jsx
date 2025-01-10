import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function SolutionDetails() {
    const navigate = useNavigate();
    const { solutionId, problemId } = useParams();
    const [solution, setSolution] = useState(null);

    useEffect(() => {
        async function fetchSolution() {
            try {
                const response = await axios.get(`https://z-coder.vercel.app/problem/${problemId}/solutions/${solutionId}`, { withCredentials: true });
                setSolution(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchSolution();
    }, [solutionId, problemId]);

    async function handleSolution() {
        navigate(`/problem/${problemId}/solutions`);
    }

    if (!solution) {
        return <div>Loading solution details...</div>;
    }

    return (
        <>
            <div className='solutions'>
                <button onClick={handleSolution}>Back to Solutions</button>
            </div>

            <div className='reviews'>
                <button onClick={()=>{
                    navigate(`/problem/${problemId}/solutions/${solutionId}/reviews`);
                }}>Reviews ({solution.reviews.length})</button>
            </div>
            
            <div className='update'>
                <button onClick={()=>{
                    navigate(`/problem/${problemId}/solutions/${solutionId}/updatesolution`)
                }}>Update Solution</button>
            </div>
            <div className='delete'>
                <button onClick={async ()=>{
                    await axios.delete(`https://z-coder.vercel.app/problem/${problemId}/solutions/${solutionId}/deletesolution` , {withCredentials :true});
                    console.log("Deleted Succssesful");
                    navigate(`problem/${problemId}/solutions`);
                }}>Delete Solution</button>
            </div>

            <div className='problem-details'>
                <h3>Solution by: @{solution.user ? <i>{solution.user.username}</i> : "Unknown User"}</h3> 
                <h3>Approach:</h3>
                <p>{solution.approach}</p>
                <h3>Solution Description:</h3>
                <p>{solution.description}</p>
                <h3>Code:</h3>
                <pre><code>{solution.code}</code></pre> 
                <br />
                <hr />
                <div className='button-group'>
                    <button onClick={()=>{
                        navigate(`/problem/${problemId}/solutions/${solutionId}/addreview`)
                    }}>Add Review</button>
                </div>
            </div>
        </>
    );
}

export default SolutionDetails;
