import React, { useEffect, useState , useContext } from 'react';
import axios from "axios";
import { useNavigate , Link } from 'react-router-dom';
import { UserContext } from "../components/UserContext.jsx";
import "./Signin.css"

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleClick = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError("Both email and password are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/signin",
                { email, password },
                { withCredentials: true }
            );
            localStorage.setItem("token" , response.data.token);
            
            localStorage.setItem("userId" ,response.data._id)
            setUser(response.data);
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
                <h1>Sign In</h1>
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
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            <p className='message'>Don't have an account? <Link to={"/signup"}>Sign Up.</Link></p>
        </div>
    );
}

export default Signin;
