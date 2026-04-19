import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { LogIn, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();
      
      if (!resp.ok) throw new Error(data.error || 'Login failed');
      
      login(data.token, data.username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-md mx-auto px-4 py-12 relative z-10 w-full">
      {/* Background ambient glow specific to auth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card p-10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

        <div className="text-center mb-10">
          <div className="bg-[#1E3A8A]/20 p-4 rounded-2xl inline-block mb-6 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
             <LogIn className="w-7 h-7 text-blue-400 stroke-[1.5]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to securely access your audit history.</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300">
            <AlertTriangle className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500">Username</label>
            <input 
              type="text" 
              required 
              value={username} onChange={(e)=>setUsername(e.target.value)}
              className="w-full bg-[#0B1120]/50 border border-white/[0.05] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#0B1120]/80 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner"
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 flex justify-between">
              Password
              <a href="#" className="font-medium text-blue-500/80 hover:text-blue-400 normal-case tracking-normal">Forgot?</a>
            </label>
            <input 
              type="password" 
              required 
              value={password} onChange={(e)=>setPassword(e.target.value)}
              className="w-full bg-[#0B1120]/50 border border-white/[0.05] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#0B1120]/80 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 font-semibold transition-all shadow-[0_4px_14px_0_rgb(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:scale-[0.98] flex justify-center items-center gap-2 mt-2">
            {loading ? 'Authenticating...' : (
              <>Sign In <ArrowRight className="w-5 h-5 ml-1" strokeWidth={2} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-white hover:text-blue-400 font-medium transition-colors">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
}
