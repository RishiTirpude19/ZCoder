import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { Code2, Users, User, LogOut, ChevronDown, Terminal, BookOpen, MessageSquare, Trophy, Briefcase } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.user._id);

  const [problemsOpen, setProblemsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const problemsRef = useRef();
  const communityRef = useRef();
  const profileRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        problemsRef.current &&
        !problemsRef.current.contains(event.target)
      ) setProblemsOpen(false);

      if (
        communityRef.current &&
        !communityRef.current.contains(event.target)
      ) setCommunityOpen(false);

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleClick() {
    setLoggingOut(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log("error while logging out");
    } finally {
      setLoggingOut(false);
    }
  }

  const dropdownLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200 ${
      isActive ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400" : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ZCoder
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-2">
          {/* Problems Dropdown */}
          <div className="relative" ref={problemsRef}>
            <button
              onClick={() => setProblemsOpen(!problemsOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-slate-300 hover:text-white group"
            >
              <Terminal className="h-4 w-4" />
              <span>Problems</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${problemsOpen ? 'rotate-180' : ''}`} />
            </button>
            {problemsOpen && (
              <div className="absolute mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl w-56 z-50 overflow-hidden">
                <div className="p-2">
                  <NavLink to="/dashboard" className={dropdownLinkClass} onClick={() => setProblemsOpen(false)}>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Dashboard
                  </NavLink>
                  <NavLink to="/bookmarkedproblems" className={dropdownLinkClass} onClick={() => setProblemsOpen(false)}>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Bookmarked
                  </NavLink>
                  <NavLink to="/myproblems" className={dropdownLinkClass} onClick={() => setProblemsOpen(false)}>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    My Problems
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Community Dropdown */}
          <div className="relative" ref={communityRef}>
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-slate-300 hover:text-white group"
            >
              <Users className="h-4 w-4" />
              <span>Community</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${communityOpen ? 'rotate-180' : ''}`} />
            </button>
            {communityOpen && (
              <div className="absolute mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl w-56 z-50 overflow-hidden">
                <div className="p-2">
                  <NavLink to="/messages" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </NavLink>
                  <NavLink to="/contests" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>
                    <Trophy className="h-4 w-4" />
                    Contests
                  </NavLink>
                  <NavLink to="/blogs" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>
                    <BookOpen className="h-4 w-4" />
                    Blogs
                  </NavLink>
                  <NavLink to="/collaborators" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>
                    <Briefcase className="h-4 w-4" />
                    Hire Collaborator
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-slate-300 hover:text-white group"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="absolute mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl w-56 z-50 overflow-hidden">
                <div className="p-2">
                  <NavLink to={`/myprofile/${userId}`} className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                    <User className="h-4 w-4" />
                    My Profile
                  </NavLink>
                  <NavLink to="/importantlinks" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Important Links
                  </NavLink>
                  <NavLink to="/askai" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    Ask AI
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleClick}
            disabled={loggingOut}
            className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              loggingOut
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50"
            }`}
          >
            {loggingOut ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
