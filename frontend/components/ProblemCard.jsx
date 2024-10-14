import React from 'react';
import './ProblemCard.css';

function ProblemCard({ user, choice, title, platform, rating, onClick }) {
    return (
    <div className="problem-card" onClick={onClick}>
        <p>{choice.toUpperCase()}</p>
        <h2>{title}</h2>
        <h3>User: {user}</h3>
        <p>Platform: {platform}</p>
        <p>Rating: {rating}</p>
    </div>
    );
}

export default ProblemCard;
