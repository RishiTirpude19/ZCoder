import React from 'react';
import "./SolutionCard.css"

function SolutionCard({ approach, onClick }) {
  return (
    <div className="solution-card" onClick={onClick}>
      <p>{approach}</p>
    </div>
  );
}

export default SolutionCard;

