import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, FileText, ArrowLeft, Image as ImageIcon, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';

export function BatchReport() {
    const location = useLocation();
    const navigate = useNavigate();
    const reports = location.state?.reports || [];
    const [downloading, setDownloading] = useState(false);

    if (!reports.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <ShieldAlert className="w-16 h-16 text-slate-600 mb-4" strokeWidth={1.5} />
                <h2 className="text-2xl font-semibold mb-2 text-slate-300">No Reports Found</h2>
                <button onClick={() => navigate('/')} className="glass-button px-8 mt-6">Return Home</button>
            </div>
        );
    }

    const downloadAll = async () => {
        setDownloading(true);
        try {
            const zip = new JSZip();
            for (const r of reports) {
                if (r.clean_url) {
                    const res = await fetch(r.clean_url);
                    const blob = await res.blob();
                    zip.file(`clean_${r.filename}`, blob);
                }
            }
            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'metaguard_clean_batch.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            console.error("Local zipping failed", e);
        }
        setDownloading(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10 w-full">
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Upload
                </button>

                <button onClick={downloadAll} disabled={downloading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:scale-[0.98] flex justify-center items-center gap-2">
                    {downloading ? <span className="animate-pulse">Zipping...</span> : <><Download className="w-4 h-4 stroke-[2]" /> Download All ({reports.length})</>}
                </button>
            </div>

            <div className="mb-10 border-b border-white/[0.05] pb-6 flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Batch Report</h1>
                   <p className="text-slate-400">Parsed {reports.length} files successfully.</p>
                </div>
                <div className="text-right">
                   <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2 justify-end mb-1"><CheckCircle className="w-4 h-4" /> All Cleaned</div>
                   <p className="text-xs text-slate-500">Ready for secure distribution.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {reports.map((report, idx) => {
                    const isHigh = report.risk_level === 'High' || report.risk_level === 'Critical';
                    return (
                        <motion.div 
                            key={report.id} 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-blue-500/20 transition-colors cursor-pointer group"
                            onClick={() => navigate(`/report/${report.id}`, { state: { report } })}
                        >
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3 overflow-hidden">
                                 {report.filename.match(/\.(jpg|jpeg|png)$/i) ? <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" /> : <FileText className="w-5 h-5 text-blue-400 shrink-0" />}
                                 <span className="text-sm font-semibold text-white truncate block" title={report.filename}>{report.filename}</span>
                              </div>
                              <span className={`shrink-0 ml-3 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest border ${isHigh ? 'text-red-400 border-red-500/20 bg-red-500/10' : report.risk_level === 'Medium' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'}`}>
                                  {report.score}/100
                              </span>
                           </div>
                           <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-500 font-medium">Metadata Found</span>
                                  <span className="text-slate-300 font-semibold">{report.metadata.length} Traces</span>
                              </div>
                              {report.lat && (
                                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-red-500 border-t border-white/[0.03] pt-3">
                                      <span className="animate-pulse">Scary geo-location detected!</span>
                                  </div>
                              )}
                              {report.metadata.some(m => m.key.includes("PC") || m.key.includes("Time") || m.key === "Creator" || m.key.includes("Modified By")) && !report.lat && (
                                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-red-500 border-t border-white/[0.03] pt-3">
                                      <span className="animate-pulse">Scary Author/Device traces!</span>
                                  </div>
                              )}
                           </div>
                           <div className="mt-4 pt-4 border-t border-white/[0.05] text-center text-xs font-semibold text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity">
                               View Detailed Report
                           </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
