

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddProblemReviews.css';

function AddProblemReviews() {
    const navigate = useNavigate();
    const { problemId } = useParams();
    const [formData, setFormData] = useState({
        rating: 1,
        comment: '',
        problem: problemId,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    function handleBTP(){
    navigate(`/problem/${problemId}`)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problem/${problemId}/addreview`, formData, {
                withCredentials: true,
            });
            console.log(response.data);
            setSuccess(response.data.message);
            navigate(`/problem/${problemId}`);
        } catch (error) {
            console.log(error);
            setError(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className='btp'>
        <button onClick={handleBTP}>Back to problem</button>
    </div>
            <div className="add-problem-review-page">
            <div className="header">
                <h1>Add a Review for Problem</h1>
            </div>
            <form className="add-problem-review-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Rating</label>
                    <select name="rating" value={formData.rating} onChange={handleChange} required>
                        <option value={1}>1 - Very Poor</option>
                        <option value={2}>2 - Poor</option>
                        <option value={3}>3 - Average</option>
                        <option value={4}>4 - Good</option>
                        <option value={5}>5 - Excellent</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Comment</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Write your review here..."
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
        </>
    );
}

export default AddProblemReviews;
