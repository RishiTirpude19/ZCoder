import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from "../components/UserContext.jsx";
import "./Signup.css";

function Signup() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username , setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleClick = async (event) => {
        event.preventDefault();
        if (!email || !password || !username) {
            setError("All feild required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`https://z-coder.vercel.app/signup`,
                { email, password, username },
                { withCredentials: true }
            );
            localStorage.setItem("token" , response.data.token);
            console.log("Signed up successfully");
            localStorage.setItem("userId" , response.data._id);
            navigate("/dashboard");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "An error occurred during sign-in.");
            } else if (err.request) {
                setError("Server did not respond. Please try again later.");
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-page">
            <div className="header">
                <h1>Sign Up</h1>
            </div>
            <form className="signin-form" onSubmit={handleClick}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder='johnDoe@gmail.com'
                        name="email"
                        id="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder='johnDoe'
                        name="username"
                        id="username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder='*******'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            <p className='message'>Already have an account? <Link to={"/signin"}>Sign In.</Link></p>
        </div>
    );
}

export default Signup;
