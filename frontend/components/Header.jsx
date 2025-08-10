import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";


function Header() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.user._id);

  const [problemsOpen, setProblemsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log("error while logging out");
    }
  }

  const dropdownLinkClass = ({ isActive }) =>
    `block px-4 py-2 hover:bg-purple-200 rounded ${
      isActive ? "bg-purple-300 font-semibold" : ""
    }`;

  return (
    <header className="bg-gradient-to-r from-[#D8B4FE] via-[#C084FC] to-[#818CF8] shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white font-semibold relative">
        <div className="flex space-x-6">

          {/* Problems Dropdown */}
          <div className="relative" ref={problemsRef}>
            <button
              onClick={() => setProblemsOpen(!problemsOpen)}
              className="px-3 py-2 rounded-md hover:bg-white/30 transition"
            >
              Problems ▼
            </button>
            {problemsOpen && (
              <div className="absolute mt-2 bg-white text-purple-900 rounded shadow-lg w-48 z-50">
                <NavLink to="/dashboard" className={dropdownLinkClass} onClick={() => setProblemsOpen(false)}>Dashboard</NavLink>
                <NavLink to="/bookmarkedproblems" className={dropdownLinkClass} onClick={() => setProblemsOpen(false)}>Bookmarked Problems</NavLink>
                <NavLink to="/myproblems" className={dropdownLinkClass} onClick={() => setProblemsOpen(false)}>My Problems</NavLink>
              </div>
            )}
          </div>

          {/* Community Dropdown */}
          <div className="relative" ref={communityRef}>
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="px-3 py-2 rounded-md hover:bg-white/30 transition"
            >
              Community ▼
            </button>
            {communityOpen && (
              <div className="absolute mt-2 bg-white text-purple-900 rounded shadow-lg w-48 z-50">
                <NavLink to="/messages" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>Messages</NavLink>
                <NavLink to="/contests" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>Contests</NavLink>
                <NavLink to="/blogs" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>Blogs</NavLink>
                <NavLink to="/collaborators" className={dropdownLinkClass} onClick={() => setCommunityOpen(false)}>Hire Collaborator</NavLink>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="px-3 py-2 rounded-md hover:bg-white/30 transition"
            >
              Profile ▼
            </button>
            {profileOpen && (
              <div className="absolute mt-2 bg-white text-purple-900 rounded shadow-lg w-48 z-50">
                <NavLink to={`/myprofile/${userId}`} className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>My Profile</NavLink>
                <NavLink to="/importantlinks" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>Important Links</NavLink>
                <NavLink to="/askai" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>Ask AI</NavLink>
              </div>
            )}
          </div>

        </div>

        <button
          onClick={handleClick}
          className="ml-4 bg-white text-[#6b21a8] px-4 py-2 rounded-md font-semibold hover:bg-[#d8b4fe] hover:text-white transition-colors duration-300"
        >
          Log Out
        </button>
      </nav>
    </header>
  );
}

export default Header;
