import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProblemReviews.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Import Font Awesome icon

function ProblemReviews() {
  const [revUser , setRevUser] = useState("");
  const currUser = localStorage.getItem("userId");
  const [reviews, setReviews] = useState([]);
  const { problemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:8080/problem/${problemId}/reviews`, {
          withCredentials: true,
        });
        console.log(currUser);
        console.log(response.data);
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
  }, []);


  async function handleDelete(reviewId) {
    try {
      await axios.delete(`http://localhost:8080/problem/${problemId}/reviews/${reviewId}`, { withCredentials: true });
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className='btp'>
        <button onClick={() => navigate(`/problem/${problemId}`)}>Back to Problem</button>
      </div>
      <div className="reviews-container">
        <h2 className="reviews-header">Problem Reviews</h2>
        <div className="reviews-grid">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review-box" key={review._id}>
                <h3 className="review-user">@<i>{review.user.username}</i></h3>
                <p className="review-rating">Rating: {review.rating}/5</p>
                <p className="review-comment">{review.comment}</p>
                
                {review.user._id === currUser ? <button 
                  className="delete-button" 
                  onClick={() => handleDelete(review._id)}
                  title="Delete review"
                >
                  <FaTrash /> 
                </button> : <></>}
              </div>
            ))
          ) : (
            <p>No reviews found for this problem.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ProblemReviews;
