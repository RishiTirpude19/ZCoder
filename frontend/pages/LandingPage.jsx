import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/LandingPage.css"
function LandingPage() {
    const navigate = useNavigate();
    const handleSignIn = () => {
        navigate("/signin");
    };
    const handleSignUp = () => {
        navigate("/signup");
    };
    return (
        <div className="landing-page">
            <div className="header"><h1>Welcome</h1></div>
            <div className="button-container">
                <button onClick={handleSignUp}>Sign Up</button>
                <button onClick={handleSignIn}>Sign In</button>
            </div>
            <div className="slogan">
                <p>"Feeling stuck? We're happy to help."</p>
            </div>
        </div>
    );
}

export default LandingPage;
