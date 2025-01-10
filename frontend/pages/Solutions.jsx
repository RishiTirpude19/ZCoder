import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SolutionCard from '../components/SolutionCard';
import './Solutions.css'; 

function Solutions() {
  const navigate = useNavigate();
  const [problem , setProblem] = useState({});
  const [solutions , setSolutions] = useState([]);
  const { problemId } = useParams();

  useEffect(()=>{
    async function fetchSolutions() {
      try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/solutions` , {withCredentials : true});
      setSolutions(response.data.solutions);
      setProblem(response.data.problem)
      } catch (error) {
        console.log(error);
      }
    }
    fetchSolutions();
  },[])

  function handelOnClick(solutionId){
    navigate(`/problem/${problemId}/solutions/${solutionId}`)
  }

  function handleBTP(){
    navigate(`/problem/${problemId}`)
  }

  if (solutions.length === 0) {
    return (<>
      <div className='btp'>
      <button onClick={handleBTP}>Back to problem</button>
    </div>
      <div className="solutions-page">
        <h1>Problem: </h1>
        <p className="problem-title">{problem.title}</p>
        <h3 className="no-solutions">No solutions Yet...</h3>
      </div>
    </>
    );
  }

  return (
    <>
    <div className='btp'>
      <button onClick={handleBTP}>Back to problem</button>
    </div>
    <div className="solutions-page">
      <h1>Problem: </h1>
      <p className="problem-title">{problem.title}</p>
      <h1>Solutions: </h1>
      <ul className="solutions-list">
        {solutions.map((solution) => (
          <li key={solution._id}>
            <SolutionCard approach={solution.approach} onClick={()=>handelOnClick(solution._id)}/>
          </li>
        ))}
      </ul>
    </div>
    </>
    
  );
}

export default Solutions

