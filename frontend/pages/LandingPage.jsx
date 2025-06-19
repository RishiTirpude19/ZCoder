import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate("/signin");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#D8B4FE] via-[#C084FC] to-[#818CF8] flex flex-col justify-center items-center px-4 text-white relative">
            {/* Optional Glass effect panel */}
            <div className="bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-lg w-full text-center">
                <h1 className="text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-md select-none cursor-default">
                    Welcome
                </h1>
                <p className="text-lg text-white/80 mb-10 select-none cursor-default">Your journey begins here</p>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button
                        onClick={handleSignUp}
                        className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-lg transition duration-300 ease-in-out select-none cursor-default"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={handleSignIn}
                        className="px-6 py-3 bg-white/80 hover:bg-white text-violet-700 font-medium rounded-xl shadow-lg transition duration-300 ease-in-out select-none cursor-default"
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <footer className="mt-16 text-center text-white/70 italic text-sm select-none cursor-default">
                <p>"Feeling stuck? We're happy to help."</p>
            </footer>
        </div>
    );
}

export default LandingPage;
