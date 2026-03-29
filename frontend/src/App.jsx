import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { About } from './pages/About';
import { HistoryDashboard } from './pages/HistoryDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, AuthContext } from './AuthContext';
import { ShieldCheck, LogOut } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path ? "text-blue-400 font-semibold" : "text-slate-300 hover:text-white";

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]">
              <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="flex tracking-tight">
                <span className="text-[22px] font-semibold text-white">Meta</span>
                <span className="text-[22px] font-semibold text-blue-500">Guard</span>
              </div>
            </Link>
          </div>
          <div className="flex space-x-6 items-center">
            <Link to="/" className={`transition-colors duration-200 ${isActive('/')}`}>Audit</Link>
            {user && <Link to="/history" className={`transition-colors duration-200 ${isActive('/history')}`}>History</Link>}
            <Link to="/about" className={`transition-colors duration-200 ${isActive('/about')}`}>About</Link>

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                <span className="text-slate-400 text-sm">Hi, {user.username}</span>
                <button onClick={logout} className="text-slate-400 hover:text-white transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Log In</Link>
                <Link to="/signup" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium px-5 py-2 rounded-full shadow-lg shadow-blue-500/20">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col items-stretch">
          <Navbar />
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report/:id" element={<Report />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<HistoryDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800 mt-auto">
            &copy; {new Date().getFullYear()} MetaGuard. Privacy First.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
