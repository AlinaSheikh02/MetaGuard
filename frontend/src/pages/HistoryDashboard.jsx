import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Shield, Clock, LogIn } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

export function HistoryDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch('http://127.0.0.1:5000/api/history', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch history:', err);
        setLoading(false);
      });
  }, [user]);

  const getRiskIcon = (level) => {
    switch (level) {
      case 'High':
      case 'Critical': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'Medium': return <Shield className="w-5 h-5 text-amber-400" />;
      case 'Low': return <ShieldCheck className="w-5 h-5 text-green-400" />;
      default: return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analysis History</h1>
          <p className="text-slate-400">Review your past image audits and risk levels.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
           <Clock className="w-4 h-4" />
           <span className="text-sm font-medium">{history.length} Records</span>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : !user ? (
        <div className="text-center py-20 glass-card p-12 max-w-lg mx-auto mt-12">
          <LogIn className="w-16 h-16 mx-auto text-blue-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
          <p className="text-slate-400 mb-8">You need to have an account to view and save your scan history.</p>
          <Link to="/login" className="glass-button">Log in to MetaGuard</Link>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 glass-card p-12">
          <Clock className="w-16 h-16 mx-auto text-slate-700 mb-6" />
          <h3 className="text-xl font-medium text-slate-300">No History Found</h3>
          <p className="text-slate-500 mt-2">You haven't uploaded any images for analysis yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={item.id}
              className="glass-card hover:bg-slate-800/80 transition-colors p-6 cursor-default border border-slate-700 hover:border-blue-500/50 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-slate-900 shadow-md`}>
                    {getRiskIcon(item.risk_level)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate max-w-[150px] text-white" title={item.filename}>{item.filename}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.upload_date).toLocaleDateString()} {new Date(item.upload_date).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold drop-shadow-sm group-hover:text-blue-400 transition-colors relative top-[-4px]">{item.score}</div>
                </div>
              </div>
              <div className="flex items-center mt-6 pt-4 border-t border-slate-800/50">
                 <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden ring-1 ring-slate-800">
                    <div 
                      className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                 </div>
                 <span className={`ml-3 text-xs font-semibold ${item.risk_level === 'High' ? 'text-red-400' : item.risk_level === 'Medium' ? 'text-amber-400' : 'text-green-400'}`}>
                    {item.risk_level} Risk
                 </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
