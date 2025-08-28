import './App.css';
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Loader2, Code2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/userSlice';

import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard.jsx';
import HeaderPages from '../components/HeaderPages.jsx';
import CalendarComponent from '../components/CalendarComponent.jsx';
import AddProblem from '../pages/AddProblem.jsx';
import Myproblems from '../pages/Myproblems.jsx';
import ProblemDetail from '../pages/ProblemDetails.jsx';
import BookMarkProblems from '../pages/BookMarkProblems.jsx';
import Solutions from '../pages/Solutions.jsx';
import AddSolution from '../pages/AddSolution.jsx';
import SolutionDetails from '../pages/SolutionDetails.jsx';
import AddProblemReviews from '../pages/AddProblemReviews.jsx';
import AddSolutionReview from '../pages/AddSolutionReview.jsx';
import ProblemReviews from '../pages/ProblemReviews.jsx';
import SolutionReviews from '../pages/SolutionReviews.jsx';
import UpdateProblem from '../pages/UpdateProblem.jsx';
import UpdateSolution from '../pages/UpdateSolution.jsx';
import MyProfile from '../pages/MyProfile.jsx';
import UpdateProfile from '../pages/UpdateProfile.jsx';
import ProblemDiscussion from '../pages/ProblemDiscussion.jsx';
import Messages from '../pages/Messages.jsx';
import Blogs from '../pages/Blogs.jsx';
import AddBlog from '../pages/AddBlog.jsx';
import AskAi from '../pages/AskAi.jsx';
import ImportantLinks from '../pages/ImportantLinks.jsx';
import AddLink from '../pages/AddLink.jsx';
import CollaborationRequest from '../pages/CollaborationRequest.jsx';
import HireCollaboraters from '../pages/HireCollaboraters.jsx';
import Profile from '../pages/Profile.jsx';
import {SocketProvider} from "../context/socketContext.jsx"

const LandingPage = React.lazy(() => import("../pages/LandingPage"));
const Signin = React.lazy(() => import("../pages/Signin"));

// Modern Loading Component
const ModernLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
    <div className="relative">
      {/* Animated Logo */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl mb-6 animate-pulse">
        <Code2 className="h-12 w-12 text-white" />
      </div>
      
      {/* Loading Text */}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">ZCoder</h2>
      
      {/* Loading Spinner */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Loading Message */}
      <p className="text-slate-400 mt-6 text-center">Loading your coding journey...</p>
    </div>
  </div>
);

function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          { withCredentials: true }
        );
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <ModernLoader />;
  }

  return (
    <Router>
      
      <Suspense fallback={<ModernLoader />}>
        <SocketProvider user={user}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <Signin />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={user ? <HeaderPages><Dashboard /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/collaborators" element={user ? <HeaderPages><HireCollaboraters /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/contests" element={user ? <HeaderPages><CalendarComponent /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/importantlinks" element={user ? <HeaderPages><ImportantLinks /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/messages" element={user ? <HeaderPages><Messages /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/importantlink/addlink" element={user ? <HeaderPages><AddLink /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/addproblem" element={user ? <HeaderPages><AddProblem /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/profile/:userId" element={user ? <HeaderPages><Profile /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/blogs" element={user ? <HeaderPages><Blogs /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/addblog" element={user ? <HeaderPages><AddBlog /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/myproblems" element={user ? <HeaderPages><Myproblems /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/askai" element={user ? <HeaderPages><AskAi /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId" element={user ? <HeaderPages><ProblemDetail /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/bookmarkedproblems" element={user ? <HeaderPages><BookMarkProblems /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/myprofile/:userId" element={user ? <HeaderPages><MyProfile /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/:recipientId/collaborator" element={user ? <HeaderPages><CollaborationRequest /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/myprofile/:userId/updateprofile" element={user ? <HeaderPages><UpdateProfile /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/solutions" element={user ? <HeaderPages><Solutions /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/discussion" element={user ? <HeaderPages><ProblemDiscussion /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/addsolution" element={user ? <HeaderPages><AddSolution /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/solutions/:solutionId" element={user ? <HeaderPages><SolutionDetails /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/addreview" element={user ? <HeaderPages><AddProblemReviews /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/solutions/:solutionId/addreview" element={user ? <HeaderPages><AddSolutionReview /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/reviews" element={user ? <HeaderPages><ProblemReviews /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/solutions/:solutionId/reviews" element={user ? <HeaderPages><SolutionReviews /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/updateproblem" element={user ? <HeaderPages><UpdateProblem /></HeaderPages> : <Navigate to="/signin" />} />
          <Route path="/problem/:problemId/solutions/:solutionId/updatesolution" element={user ? <HeaderPages><UpdateSolution /></HeaderPages> : <Navigate to="/signin" />} />
        </Routes>
        </SocketProvider>
      </Suspense>
      
    </Router>
  );
}

export default App;
