import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from "../components/UserContext.jsx";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token'); 
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleClick = async (event) => {
        event.preventDefault();
        if (!email || !password || !username) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`,
                { email, password, username },
                { withCredentials: true }
            );
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("userId", response.data._id);
            navigate("/dashboard");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "An error occurred during sign-up.");
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] p-4">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
                <h1 className="text-3xl font-semibold mb-6 text-center select-none cursor-default">Sign Up</h1>
                <form className="space-y-5" onSubmit={handleClick}>
                    <div className="select-none cursor-default">
                        <label htmlFor="email" className="block text-sm font-medium mb-1 select-none cursor-default">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="johnDoe@gmail.com"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 "
                        />
                    </div>

                    <div className="select-none cursor-default">
                        <label htmlFor="username" className="block text-sm font-medium mb-1 select-none cursor-default">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="johnDoe"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                    </div>

                    <div  className="select-none cursor-default">
                        <label htmlFor="password" className="block text-sm font-medium mb-1 select-none cursor-default">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="*******"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-default"
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {error && <p className="text-sm text-red-200 mt-4 text-center">{error}</p>}

                <p className="mt-6 text-center text-sm text-white/80">
                    Already have an account?{" "}
                    <Link
                        to="/signin"
                        className="underline text-white font-medium hover:text-violet-200 select-none cursor-default"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
