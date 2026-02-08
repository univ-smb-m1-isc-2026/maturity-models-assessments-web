import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import AuthService from './services/auth.service'
import { IUser } from './types/user.type'
import TeamDetails from './components/TeamDetails'
import AssessmentView from './components/AssessmentView'
import Register from './components/Register'

function Home() {
  const [message, setMessage] = useState<string>('Chargement...')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    axios.get('http://localhost:8080/api/hello')
      .then(response => {
        setMessage(response.data.message)
        setStatus('success')
      })
      .catch(error => {
        console.error('Error connecting to backend:', error)
        setMessage('Impossible de connecter au serveur backend.')
        setStatus('error')
      })
  }, [])

  return (
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Évaluez la maturité de vos équipes
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-slate-400">
            Un outil simple et efficace pour mesurer, analyser et améliorer les processus de votre organisation.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900 overflow-hidden shadow-xl rounded-lg border border-slate-800">
            <div className="px-4 py-5 sm:px-6 border-b border-slate-800">
              <h3 className="text-lg leading-6 font-medium text-slate-100">
                État du Système
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Vérification de la connexion avec l'API Backend.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className={`rounded-md p-4 ${
                status === 'success' ? 'bg-green-900/30 border border-green-800' : 
                status === 'error' ? 'bg-red-900/30 border border-red-800' : 
                'bg-blue-900/30 border border-blue-800'
              }`}>
                <div className="flex">
                    <div className="shrink-0">
                    {status === 'success' ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : status === 'error' ? (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className={`text-sm ${
                      status === 'success' ? 'text-green-300' : 
                      status === 'error' ? 'text-red-300' : 
                      'text-blue-300'
                    }`}>
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(() => AuthService.getCurrentUser());

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    window.location.href = "/login";
  };

  return (
    <Router>
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
                    {currentUser.roles?.includes("ROLE_PMO") && (
                      <Link to={"/admin/models"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Admin Models
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
                    <button onClick={logOut} className="bg-red-700 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                      LogOut
                    </button>
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teams/:id" element={<TeamDetails />} />
        <Route path="/assessments/:id" element={<AssessmentView />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App;
