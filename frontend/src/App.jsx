import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { BatchReport } from './pages/BatchReport';
import { About } from './pages/About';
import { HistoryDashboard } from './pages/HistoryDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, AuthContext } from './AuthContext';
import { ShieldCheck, LogOut } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path ? "text-white font-medium" : "text-slate-400 hover:text-slate-200 transition-colors";

  return (
    <nav className="border-b border-white/[0.03] bg-[#0A0F1C]/80 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center shrink-0 border border-blue-400/30 bg-blue-500/10 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-blue-400/10"></div>
                <ShieldCheck className="w-4 h-4 text-blue-400 relative z-10" strokeWidth={2} />
              </div>
              <div className="flex tracking-tight">
                <span className="text-lg font-bold text-white tracking-widest uppercase">Meta</span>
                <span className="text-lg font-bold text-blue-500 tracking-widest uppercase">Guard</span>
              </div>
            </Link>
          </div>
          <div className="flex space-x-8 items-center">
            <Link to="/" className={`text-xs tracking-widest uppercase ${isActive('/')}`}>Audit</Link>
            {user && <Link to="/history" className={`text-xs tracking-widest uppercase ${isActive('/history')}`}>History</Link>}
            <Link to="/about" className={`text-xs tracking-widest uppercase ${isActive('/about')}`}>About</Link>

            {user ? (
              <div className="flex items-center gap-4 ml-2 pl-6 border-l border-white/[0.08]">
                <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">{user.username}</span>
                <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-2 pl-6 border-l border-white/[0.08]">
                <Link to="/login" className="text-slate-400 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors px-2">Log In</Link>
                <Link to="/signup" className="hidden sm:inline-flex bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)] text-blue-400 hover:text-blue-300 transition-all text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-lg">Sign Up</Link>
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
              <Route path="/batch-report" element={<BatchReport />} />
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
