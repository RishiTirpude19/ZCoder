import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from '../pages/Signup';
import PreventRoute from '../components/PreventRoute';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pages/Dashboard';
import HeaderPages from '../components/HeaderPages';
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
import { UserProvider } from '../components/UserContext.jsx';
import UpdateProblem from '../pages/UpdateProblem.jsx';
import UpdateSolution from '../pages/UpdateSolution.jsx';
import MyProfile from '../pages/MyProfile.jsx';
import UpdateProfile from '../pages/UpdateProfile.jsx';
import ProblemDiscussion from '../pages/ProblemDiscussion.jsx';

const LandingPage = React.lazy(() => import("../pages/LandingPage"));
const Signin = React.lazy(() => import("../pages/Signin"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/signin"
            element={
              
                <PreventRoute>
                <Signin/>
              </PreventRoute>
              
            }
          />
          <Route
            path="/signup"
            element={
              <PreventRoute>
                <Signup></Signup>
              </PreventRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <Dashboard/>
                </HeaderPages>
              </PrivateRoute>
                
            }
          />
          <Route
            path='/contests'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <CalendarComponent/>
                </HeaderPages>
              </PrivateRoute>
                
            }
          />
          <Route
            path='/addproblem'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <AddProblem/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/myproblems'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <Myproblems/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId'
            element={
              
                <PrivateRoute>
                <HeaderPages>
                  <ProblemDetail/>
                </HeaderPages>
              </PrivateRoute>
              
            }
          />
          <Route
            path='/bookmarkedproblems'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <BookMarkProblems/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/myprofile'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <MyProfile/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/myprofile/:userId/updateprofile'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <UpdateProfile/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/solutions'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <Solutions/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/discussion'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <ProblemDiscussion/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/addsolution'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <AddSolution/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/solutions/:solutionId'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <SolutionDetails/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/addreview'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <AddProblemReviews/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/solutions/:solutionId/addreview'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <AddSolutionReview/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/reviews'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <ProblemReviews/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/solutions/:solutionId/reviews'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <SolutionReviews/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/updateproblem'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <UpdateProblem/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
          <Route
            path='/problem/:problemId/solutions/:solutionId/updatesolution'
            element={
              <PrivateRoute>
                <HeaderPages>
                  <UpdateSolution/>
                </HeaderPages>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
