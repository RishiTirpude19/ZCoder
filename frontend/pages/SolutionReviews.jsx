import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProblemReviews.css';
import { useNavigate, useParams } from 'react-router-dom';


function SolutionReviews() {
  const [reviews, setReviews] = useState([]);
  const {problemId , solutionId} = useParams()
  const navigate = useNavigate();

    useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`https://z-coder.vercel.app/problem/${problemId}/solutions/${solutionId}/reviews`, {
          withCredentials: true,
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
  }, []);

  return (
    <>
    <div className='btp'>
      <button onClick={()=>{
        navigate(`/problem/${problemId}/solutions/${solutionId}`)
      }}>Back to Solution</button>
    </div>
      <div className="reviews-container">
      <h2 className="reviews-header">Solution Reviews</h2>
      <div className="reviews-grid">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="review-box" key={review._id}>
              <h3 className="review-user">@<i>{review.user.username}</i></h3>
              <p className="review-rating">Rating: {review.rating}/5</p>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews found for this problem.</p>
        )}
      </div>
    </div>
    </>
  )
}

export default SolutionReviews
