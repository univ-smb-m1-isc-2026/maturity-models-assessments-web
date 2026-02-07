import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Verify from "./components/Verify";
import TeamsDashboard from "./components/TeamsDashboard";
import TeamDetails from "./components/TeamDetails";
import MaturityModelsAdmin from "./components/MaturityModelsAdmin";
import AssessmentView from "./components/AssessmentView";
import { IUser } from "./types/user.type";

const App = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(AuthService.getCurrentUser());

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="bg-slate-900 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={"/"} className="text-xl font-semibold text-slate-100 tracking-tight">
                Maturity Assessment
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to={"/"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Accueil
                </Link>
                {currentUser && (
                  <>
                    <Link to={"/teams"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Teams
                    </Link>
                    {currentUser.roles && currentUser.roles.includes("ROLE_PMO") && (
                      <Link to={"/admin/models"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Maturity Models
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
                {currentUser ? (
                  <>
                    <Link to={"/profile"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      {currentUser.firstName} {currentUser.lastName}
                    </Link>
                    <a href="/login" className="bg-red-700 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm" onClick={logOut}>
                      LogOut
                  </a>
                </>
              ) : (
                <>
                  <Link to={"/login"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link to={"/register"} className="bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-3 mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/teams" element={<TeamsDashboard />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/admin/models" element={<MaturityModelsAdmin />} />
          <Route path="/assessments/:id" element={<AssessmentView />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
