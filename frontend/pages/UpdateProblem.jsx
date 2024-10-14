import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./UpdateProblem.css";

function UpdateProblem() {
    const { problemId } = useParams(); 
    const [formData, setFormData] = useState({
        title: '',
        problemstatement: {
            statement: '',
            input: '',
            output: '',
            exampleinput: '',
            exampleoutput: '',
        },
        choice: 'public', 
        platform: {
            name: '',
            rating: '',
        },
        link: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblemDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/problem/${problemId}`, {
                    withCredentials: true,
                });
                
                setFormData(response.data.problem);
            } catch (error) {
                setError(error.response ? error.response.data.message : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblemDetails();
    }, [problemId]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');

    if (subKey) {
        setFormData(prevFormData => ({
            ...prevFormData,
            [mainKey]: {
                ...prevFormData[mainKey],
                [subKey]: value,
            } || {} 
        }));
    } else {
        setFormData({
            ...formData,
            [name]: value,
        });
    }
};


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(`http://localhost:8080/problem/${problemId}/updateproblem`, formData, {
                withCredentials: true,
            });
            setSuccess(response.data.message);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-problem-page">
            <div className="header">
                <h1>Edit Problem</h1>
            </div>
            <form className="edit-problem-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Problem Statement</label>
                    <textarea cols={30} rows={7} name="problemstatement.statement" value={formData.problemstatement.statement} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Input</label>
                    <textarea cols={30} rows={5} name="problemstatement.input" value={formData.problemstatement.input} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Output</label>
                    <textarea cols={30} rows={5} name="problemstatement.output" value={formData.problemstatement.output} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Example Input</label>
                    <textarea cols={30} rows={10} name="problemstatement.exampleinput" value={formData.problemstatement.exampleinput} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Example Output</label>
                    <textarea cols={30} rows={10} name="problemstatement.exampleoutput" value={formData.problemstatement.exampleoutput} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Choice</label>
                    <select name="choice" value={formData.choice} onChange={handleChange}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Platform Name</label>
                    <input type="text" name="platform.name" value={formData.platform.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Platform Ratings</label>
                    <input type="number" name="platform.rating" value={formData.platform.rating} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Link</label>
                    <input type="url" name="link" value={formData.link} onChange={handleChange} required />
                </div>
                <button className='btp' type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    );
}

export default UpdateProblem;
