import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Shield, Download, ArrowLeft, Image as ImageIcon, CheckCircle, Navigation, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Report() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-slate-600 mb-4" strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold mb-2 text-slate-300">Report Not Found</h2>
        <p className="text-slate-500 mb-6 max-w-md">We couldn't find the analysis report for this image. It may have expired or was never uploaded.</p>
        <button onClick={() => navigate('/')} className="glass-button px-8">Return Home</button>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'High':
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.1)]';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20 shadow-[0_0_15px_rgba(148,163,184,0.1)]';
    }
  };

  const getScoreColorHex = (score) => {
    if (score >= 80) return '#34d399'; // emerald-400
    if (score >= 50) return '#fbbf24'; // amber-400
    return '#f87171'; // red-400
  };

  const Icon = report.risk_level === 'High' ? ShieldAlert : report.risk_level === 'Medium' ? Shield : ShieldCheck;

  // Calculate circumference for circular gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.score / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative z-10 w-full">
      {/* Background glow specific to report */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-white mb-10 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Upload
      </button>

      <div className="grid lg:grid-cols-3 gap-6 mb-12 relative z-10">
        {/* Risk Summary Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 glass-card p-8 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          
          <h2 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-8 flex items-center justify-between">
            Privacy Rating
            <Icon className={`w-4 h-4 ${report.risk_level === 'High' ? 'text-red-400' : report.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`} />
          </h2>
          
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="stroke-slate-800" strokeWidth="6" fill="none" />
                <motion.circle 
                  cx="50" cy="50" r={radius} 
                  stroke={getScoreColorHex(report.score)} 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white tracking-tight">{report.score}</span>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Score</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1120]/60 border border-white/[0.03]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Severity</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border overflow-hidden whitespace-nowrap ${getRiskColor(report.risk_level)}`}>
                  {report.risk_level}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1120]/60 border border-white/[0.03]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Metadata</span>
                <span className="text-sm font-semibold text-slate-200">{report.metadata.length} Found</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Detail Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-8 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-5 mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
               <ImageIcon className="w-5 h-5 text-blue-400 stroke-[1.5]" /> File Profile
            </h3>
            <span className="text-xs font-mono text-slate-500 bg-[#0B1120] px-3 py-1 rounded border border-white/[0.05] truncate max-w-[200px]" title={report.filename}>
              {report.filename}
            </span>
          </div>

          <div className="flex-1 text-sm text-slate-300 space-y-6">
            <p className="leading-relaxed">
              MetaGuard has securely sandboxed and evaluated the payload. 
              {report.risk_level === 'High' 
                ? " Critical identifiers such as precise GPS coordinates or unique device telemetry were uncovered. Immediate scrubbing is recommended before external distribution." 
                : " Basic digital footprints were identified. Minimal geographic exposure detected, but standard hygiene scrubbing is available."}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="p-4 bg-[#0B1120]/40 rounded-xl border border-white/[0.03]">
                  <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">Status</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 stroke-[2]" /> Analysed & Scanned
                  </span>
               </div>
               <div className="p-4 bg-[#0B1120]/40 rounded-xl border border-white/[0.03]">
                  <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">Data Weight</span>
                  <span className="text-sm font-semibold text-white">{report.metadata.length} Traces</span>
               </div>
            </div>

            {report.lat && report.lng && (
              <div className="mt-6 rounded-xl overflow-hidden border border-red-500/30 shadow-[0_0_20px_rgba(248,113,113,0.15)] transition-all">
                 <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/20 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-red-400 animate-pulse" /> 
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">Scary: Location Extracted</span>
                 </div>
                 <div className="w-full relative h-[250px] bg-[#0A0F1C]">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.lng-0.05},${report.lat-0.05},${report.lng+0.05},${report.lat+0.05}&layer=mapnik&marker=${report.lat},${report.lng}`}
                        className="opacity-80 mix-blend-screen invert hue-rotate-180 contrast-125 Filter pointer-events-none" 
                    ></iframe>
                 </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/[0.05]">
            <a 
              href={`http://127.0.0.1:5000${report.clean_url}`} 
              download={`clean_${report.filename}`}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 font-semibold transition-all shadow-[0_4px_14px_0_rgb(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:scale-[0.98] flex justify-center items-center gap-2"
            >
              <Download className="w-5 h-5 stroke-[2]" /> Download Sanitized File
            </a>
          </div>
        </motion.div>
      </div>

      {/* Metadata Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 relative"
      >
        <div className="px-10 py-8 border-b border-white/[0.05] bg-[#0A0F1C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="text-xl font-bold text-white flex items-center gap-3">
             <Shield className="w-6 h-6 text-blue-400 stroke-[1.5]" /> Intercepted Metadata
           </h3>
           <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.1)]">
             Raw Extraction
           </span>
        </div>
        
        {report.metadata.length === 0 ? (
          <div className="p-16 text-center bg-[#0B1120]/40">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-50 stroke-[1.5]" />
            <p className="text-base text-slate-200 font-medium mb-1">Zero footprints detected.</p>
            <p className="text-sm text-slate-500">The file structure contains no readable metadata tags.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#0B1120]/80 border-b border-white/[0.05]">
                  <th className="py-6 px-10 font-semibold text-slate-500 text-xs tracking-[0.2em] uppercase w-1/4">Property Key</th>
                  <th className="py-6 px-10 font-semibold text-slate-500 text-xs tracking-[0.2em] uppercase w-1/2">Decoded Value</th>
                  <th className="py-6 px-10 font-semibold text-slate-500 text-xs tracking-[0.2em] uppercase w-1/4 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] bg-[#0B1120]/20">
                {report.metadata.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/[0.02] transition-colors">
                    <td className="py-8 px-10 text-sm font-semibold text-slate-300">{item.key}</td>
                    <td className="py-8 px-10 text-base text-slate-400 truncate max-w-sm font-mono bg-[#0A0F1C]/50" title={item.value}>{item.value}</td>
                    <td className="py-8 px-10 text-right">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest border ${getRiskColor(item.risk)}`}>
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
