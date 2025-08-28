import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Zap, Users, Trophy, ArrowRight, Github, Linkedin, Twitter, Play } from 'lucide-react';

function LandingPage() {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate("/signin");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                        <Code2 className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ZCoder
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSignIn}
                        className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-8">
                        <Zap className="h-5 w-5 text-blue-400" />
                        <span className="text-blue-400 font-medium">The Collaborative Coding Platform</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                        Master Coding
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Like a Pro
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Join developers solving problems, 
                        collaborating on solutions, and building their coding expertise 
                        in a supportive community.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                        <button
                            onClick={handleSignUp}
                            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-3"
                        >
                            Start Coding Now
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                        
                        {/* <button className="group bg-slate-800/50 hover:bg-slate-800/70 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 flex items-center justify-center gap-3">
                            <Play className="h-5 w-5" />
                            Watch Demo
                        </button> */}
                    </div>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">10K+</div>
                            <div className="text-slate-400">Active Developers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">50K+</div>
                            <div className="text-slate-400">Problems Solved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">95%</div>
                            <div className="text-slate-400">Success Rate</div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Code2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Problem Solving</h3>
                        <p className="text-slate-400">Access a vast collection of coding challenges.</p>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Community</h3>
                        <p className="text-slate-400">Connect with fellow developers, share solutions, and learn together.</p>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Trophy className="h-8 w-8 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
                        <p className="text-slate-400">Track your progress and climb the leaderboard.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                                    <Code2 className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    ZCoder
                                </span>
                            </div>
                            <p className="text-slate-400 mb-4">
                                Encoraging developers to solve problems, learn, and grow together.
                            </p>
                            {/* <div className="flex gap-4">
                                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                                    <Github className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                                    <Twitter className="h-5 w-5" />
                                </a> */}
                            {/* </div> */}
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Problems</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Solutions</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Blogs</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Contests</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Community</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Discussions</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Collaboration</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Mentorship</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Events</a></li>
                            </ul>
                        </div>

                        {/* <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                            </ul>
                        </div> */}
                    </div>

                    <div className="border-t border-slate-800/50 mt-12 pt-8 text-center text-slate-400">
                        <p>&copy; 2024 ZCoder. All rights reserved. Built with ❤️ for developers.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
