import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import AuthService from './services/auth.service'
import { IUser } from './types/user.type'
import TeamDetails from './components/TeamDetails'
import AssessmentView from './components/AssessmentView'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import MaturityModelsAdmin from './components/MaturityModelsAdmin'
import TeamsDashboard from './components/TeamsDashboard'
import Verify from './components/Verify'
import TeamInvitations from './components/TeamInvitations'
import InvitationAccept from './components/InvitationAccept'

function Home() {
  return (
    <main className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-8%] top-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_45%),linear-gradient(rgba(15,23,42,0.2),rgba(2,6,23,0.9))]" />
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Plateforme d&apos;évaluation de maturité pour équipes et organisations
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Pilotez la maturité de vos équipes avec une vision claire et actionnable.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Centralisez vos évaluations, suivez les progrès dans le temps et repérez rapidement les axes d&apos;amélioration.
              Conçu pour présenter des résultats compréhensibles sans jargon technique.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
              >
                Créer un compte
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
              >
                Se connecter
              </a>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur">
                <dt className="text-sm text-slate-400">Équipes suivies</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">Tout au même endroit</dd>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur">
                <dt className="text-sm text-slate-400">Tableaux de bord</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">Lecture rapide</dd>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur">
                <dt className="text-sm text-slate-400">Décisions</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">Priorités claires</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -rotate-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 to-amber-400/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-sm font-medium text-cyan-300">Vue produit</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Une expérience simple et sérieuse</h2>
                </div>
                <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                  Présentation
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="font-medium text-white">Évaluations structurées</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Des questionnaires lisibles pour collecter des retours homogènes et comparables.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="font-medium text-white">Suivi des tendances</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Visualisez les évolutions dans le temps pour mesurer les progrès réels.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="font-medium text-white">Gestion des équipes</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Admins, membres et invitations restent regroupés dans un flux clair.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="font-medium text-white">Accès maîtrisé</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Connexion, rôles et permissions sont prévus pour un usage en contexte réel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Des évaluations lisibles</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Les équipes comprennent rapidement où elles se situent et ce qui doit être priorisé.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Une navigation simple</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Les routes principales restent accessibles sans exposer de détails techniques inutiles sur la page d&apos;accueil.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Prêt pour la démo</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              La landing page présente le produit comme une vraie application, pas comme un écran de diagnostic.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(() => AuthService.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    window.location.href = "/login";
  };

  return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
        <nav className="bg-slate-900 border-b border-slate-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={"/"} className="text-xl font-semibold text-slate-100 tracking-tight">
                MMaturity
              </Link>
              <div className="hidden md:flex items-baseline gap-2">
                <Link to={"/"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Accueil
                </Link>
                {currentUser && (
                  <>
                    <Link to={"/teams"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Équipes
                    </Link>
                    {currentUser.roles?.includes("ROLE_PMO") && (
                      <Link to={"/admin/models"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Modèles d'évaluation
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

             <div className="hidden md:flex items-center gap-4">
                {currentUser ? (
                  <>
                    <Link to={"/profile"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      {currentUser.firstName} {currentUser.lastName}
                    </Link>
                    <button onClick={logOut} className="bg-red-700 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={"/login"} className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Connexion
                    </Link>
                    <Link to={"/register"} className="bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                      Créer un compte
                    </Link>
                  </>
                )}
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-slate-800 md:hidden"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-slate-700">
            <div className="px-2 py-3 space-y-1">
              <Link
                to={"/"}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accueil
              </Link>
              {currentUser && (
                <>
                  <Link
                    to={"/teams"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Équipes
                  </Link>
                  {currentUser.roles?.includes("ROLE_PMO") && (
                    <Link
                      to={"/admin/models"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Modèles d'évaluation
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="border-t border-slate-700 px-2 py-3">
              {currentUser ? (
                <div className="space-y-2">
                  <Link
                    to={"/profile"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {currentUser.firstName} {currentUser.lastName}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logOut();
                    }}
                    className="w-full bg-red-700 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to={"/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to={"/register"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm text-center"
                  >
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/models" element={<MaturityModelsAdmin />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teams" element={<TeamsDashboard />} />
        <Route path="/teams/:id" element={<TeamDetails />} />
        <Route path="/teams/:id/invitations" element={<TeamInvitations />} />
        <Route path="/invitations/accept" element={<InvitationAccept />} />
        <Route path="/assessments/:id" element={<AssessmentView />} />
      </Routes>
      </div>
  )
}

export default App;
