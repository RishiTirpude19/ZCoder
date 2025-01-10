import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSolution.css'; 

function UpdateSolution() {
    const { solutionId, problemId } = useParams(); 
    const [formData, setFormData] = useState({
        approach: '',
        description: '',
        code: '',
        problem: problemId,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchSolution = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://z-coder.vercel.app/problem/${problemId}/solutions/${solutionId}`, {
                    withCredentials: true,
                });
                setFormData({
                    approach: response.data.approach,
                    description: response.data.description,
                    code: response.data.code,
                    problem: problemId,
                });
            } catch (error) {
                setError(error.response ? error.response.data.message : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSolution();
    }, [solutionId, problemId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(`https://z-coder.vercel.app/problem/${problemId}/solutions/${solutionId}/updatesolution`, formData, {
                withCredentials: true,
            });
            setSuccess(response.data.message);
            navigate(`/problem/${problemId}/solutions/${solutionId}`);
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    };

    function handleBTP() {
        navigate(`/problem/${problemId}/solutions/${solutionId}`);
    }

    return (
        <>
            <div className='btp'>
                <button onClick={handleBTP}>Back to Solution</button>
            </div>
            <div className="add-solution-page">
                <div className="header">
                    <h1>Update Solution</h1>
                </div>
                <form className="add-solution-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Approach</label>
                        <textarea name="approach" rows={5} cols={20} value={formData.approach} onChange={handleChange} required></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" rows={10} cols={20} value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="form-group">
                        <label>Code</label>
                        <textarea name="code" value={formData.code} cols={20} rows={20} onChange={handleChange} required></textarea>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </form>
            </div>
        </>
    );
}

export default UpdateSolution;
