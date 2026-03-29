import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Shield, Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function Report() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-slate-300">Report Not Found</h2>
        <p className="text-slate-500 mb-6 max-w-md">We couldn't find the analysis report for this image. It may have expired or was never uploaded.</p>
        <button onClick={() => navigate('/')} className="glass-button">Return Home</button>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'High':
      case 'Critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const Icon = report.risk_level === 'High' ? ShieldAlert : report.risk_level === 'Medium' ? Shield : ShieldCheck;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Upload
      </button>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl"
        >
          <div className={`p-6 rounded-full ${getRiskColor(report.risk_level).replace('border-', 'border-2 ')}`}>
             <Icon className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Privacy Score</h2>
          <div className={`text-6xl font-extrabold ${getScoreColor(report.score)} drop-shadow-lg`}>
            {report.score}<span className="text-2xl text-slate-500">/100</span>
          </div>
          <p className="text-slate-400 font-medium">Risk Level: <span className={`font-bold ${getRiskColor(report.risk_level).split(' ')[0]}`}>{report.risk_level}</span></p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-8 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
               <ImageIcon className="w-6 h-6 text-blue-400" /> Image Details
            </h3>
            <p className="text-slate-300 text-lg mb-6">
               <span className="font-semibold text-white">Filename:</span> {report.filename}
            </p>
            <div className="prose prose-invert border-l-4 border-blue-500 pl-6 text-slate-400 bg-slate-800/20 py-4 rounded-r-xl">
               <p>This image contains <strong>{report.metadata.length}</strong> readable metadata tags. {report.risk_level === 'High' ? "Critical information like GPS boundaries and make models has been exposed." : "No critical geolocation data was found, but basic footprints remain."}</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <a 
              href={`http://127.0.0.1:5000${report.clean_url}`} 
              download={`clean_${report.filename}`}
              className="glass-button flex-1 flex justify-center items-center gap-2"
            >
              <Download className="w-5 h-5" /> Download Clean Image
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
           <h3 className="text-xl font-bold text-white">Extracted Metadata</h3>
           <span className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{report.metadata.length} items found</span>
        </div>
        
        {report.metadata.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No metadata detected in this image.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-800">
                  <th className="py-4 px-8 font-semibold text-slate-300 w-1/4">Property</th>
                  <th className="py-4 px-8 font-semibold text-slate-300 w-1/2">Value</th>
                  <th className="py-4 px-8 font-semibold text-slate-300 w-1/4">Risk Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {report.metadata.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-8 font-medium text-slate-200">{item.key}</td>
                    <td className="py-4 px-8 text-slate-400 truncate max-w-xs" title={item.value}>{item.value}</td>
                    <td className="py-4 px-8">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(item.risk)}`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
