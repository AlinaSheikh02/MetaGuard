import { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Shield, CheckCircle, AlertTriangle, FileText, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processFileLocally } from '../utils/localProcessor';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareSafe, setShareSafe] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gsap-reveal", {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gsap-trigger",
          start: "top 85%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    validateAndSetFiles(Array.from(e.target.files));
  };

  const validateAndSetFiles = (selectedFiles) => {
    setError(null);
    if (!selectedFiles || selectedFiles.length === 0) return;

    const validExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx', 'pptx'];
    const valid = selectedFiles.filter(f => validExtensions.includes(f.name.split('.').pop().toLowerCase()));
    
    if (valid.length === 0) {
      setError('Please upload valid images (JPG, PNG) or documents (PDF, DOCX, XLSX, PPTX).');
      return;
    }

    setFiles(valid);

    if (valid[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(valid[0]);
    } else {
      setPreview('document'); 
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const reports = [];
      for (const f of files) {
          const report = await processFileLocally(f);
          
          // Optionally send an anonymized hash/history back to server if user is logged in
          if (user && user.token) {
              fetch('http://127.0.0.1:5000/api/history-sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                  body: JSON.stringify({ filename: f.name, score: report.score, risk_level: report.risk_level })
              }).catch(()=>console.log("History sync failed"));
          }
          reports.push(report);
      }

      if (reports.length > 1) {
          navigate('/batch-report', { state: { reports } });
      } else {
          navigate(`/report/${reports[0].id}`, { state: { report: reports[0] } });
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Background gradients */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
              <Shield className="w-3.5 h-3.5" /> Secure Metadata Removal
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Protect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Privacy</span> Before You Post
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload any image or document to analyze hidden metadata, reveal geolocation risks, and instantly sanitize your files.
            </p>
          </motion.div>
        </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-[1px] mb-8 shadow-2xl relative"
      >
        <div className="bg-[#0B1120] rounded-[15px] p-8 md:p-12 w-full h-full relative overflow-hidden">
        {/* Subtle glow effect behind drop zone */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div
          className={`border rounded-2xl p-12 text-center transition-all duration-500 relative z-10 ${files.length > 0 ? 'border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)] bg-blue-500/5' : 'border-white/[0.08] hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-black/20'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {files.length > 0 ? (
            <div className="flex flex-col items-center">
              {preview === 'document' ? (
                <div className="w-48 h-48 mb-6 rounded-lg border border-slate-700 bg-slate-800/50 flex items-center justify-center flex-col shrink-0">
                  <FileText className="w-16 h-16 text-blue-400 mb-2" />
                  <span className="text-slate-400 text-sm font-medium">{files[0].name.split('.').pop().toUpperCase()}</span>
                </div>
              ) : (
                <div className="relative w-48 h-48 mb-6 rounded-lg overflow-hidden border border-slate-700 shadow-xl shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                    <Shield className="text-green-400 w-6 h-6" />
                  </div>
                </div>
              )}
              <p className="text-lg font-medium mb-1 truncate max-w-sm">{files.length === 1 ? files[0].name : `${files.length} files selected`}</p>
              <p className="text-sm text-slate-400 mb-4">{files.length > 1 ? 'Batch processing mode active' : `${(files[0].size / 1024 / 1024).toFixed(2)} MB`}</p>

              {(files.length === 1 && files[0].type.startsWith('image/')) && (
                <label className="flex items-center gap-3 mb-6 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700 cursor-pointer hover:border-blue-500/50 transition-colors">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={shareSafe} onChange={(e) => setShareSafe(e.target.checked)} className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-slate-500 rounded bg-slate-900 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors flex items-center justify-center">
                      {shareSafe && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 whitespace-nowrap"><Share2 className="w-4 h-4 text-blue-400" /> Share-safe Mode</span>
                    <span className="text-xs text-slate-400">Compresses to 1080p and strips all EXIF chunks specifically for social media.</span>
                  </div>
                </label>
              )}

              <div className="flex gap-4">
                <button onClick={() => { setFiles([]); setPreview(null); }} className="px-6 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                  Clear
                </button>
                <button onClick={handleUpload} disabled={loading} className="glass-button flex items-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 animate-bounce" /> Processing...
                    </span>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" /> Analyze Files
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(37,99,235,0.1)] group-hover:scale-105 transition-transform">
                <UploadCloud className="w-10 h-10 text-blue-400 stroke-[1.5]" />
              </div>
              <p className="text-xl font-bold tracking-tight mb-2 text-white">Drop files or folder here</p>
              <p className="text-slate-400 mb-8 font-medium">Supports JPG, PNG, PDF, DOCX, XLSX, PPTX</p>
              <div className="flex gap-4">
                <label className="glass-button cursor-pointer text-sm px-6">
                  <span>Select Files</span>
                  <input type="file" className="hidden" multiple accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.pptx" onChange={handleFileInput} />
                </label>
                <label className="glass-button cursor-pointer text-sm px-6">
                  <span>Select Folder</span>
                  <input type="file" className="hidden" webkitdirectory="" directory="" multiple onChange={handleFileInput} />
                </label>
              </div>
            </div>
          )}
        </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 shadow-lg"
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it Works Section */}
      <div className="mt-32 pt-8 relative gsap-trigger">
        <div className="text-center mb-16 gsap-reveal">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-500 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-4 inline-block">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4 tracking-tight">Clean in three steps. <span className="text-slate-400 font-medium">No noise, no friction.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          <div className="glass-card p-10 flex flex-col items-center text-center group gsap-reveal">
            <div className="bg-[#1E3A8A]/20 p-5 rounded-2xl text-blue-400 mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.15)] group-hover:scale-110 group-hover:bg-[#1E3A8A]/40 transition-all duration-300">
              <UploadCloud className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">1. Upload</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Drop your file into our secure area. It never gets uploaded to any public servers.</p>
          </div>
          <div className="glass-card p-10 flex flex-col items-center text-center group gsap-reveal">
            <div className="bg-amber-500/10 p-5 rounded-2xl text-amber-400 mb-6 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <AlertTriangle className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">2. Audit</h3>
            <p className="text-slate-400 leading-relaxed text-sm">We scan the file and show you exactly what hidden info is lurking inside.</p>
          </div>
          <div className="glass-card p-10 flex flex-col items-center text-center group gsap-reveal">
            <div className="bg-green-500/10 p-5 rounded-2xl text-green-400 mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
              <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">3. Cleanse</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Get a safe, clean copy of your file with all the hidden data removed.</p>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="mt-24 mb-12 flex flex-col md:flex-row justify-center items-center gap-10 border-y border-white/[0.05] py-10 bg-[#111827]/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-green-400" />
          <span className="text-lg font-semibold text-slate-200">100% Private - Files never stored</span>
        </div>
        <div className="hidden md:block w-px h-10 bg-white/[0.08]"></div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-blue-400" />
          <span className="text-lg font-semibold text-slate-200">Completely Free - No limits</span>
        </div>
      </div>

      {/* Top Tasks Features Section */}
      <div className="pt-12 pb-16 gsap-trigger">
        <div className="text-center mb-16 gsap-reveal">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-500 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-4 inline-block">Top Tasks</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-5 tracking-tight">The highest-intent workflows.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the specific metadata cleanup task that matches your file type or sharing problem.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-8 group cursor-pointer gsap-reveal hover:border-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Images</span>
            <h3 className="text-xl font-bold text-white mt-5 mb-3 group-hover:text-blue-400 transition-colors">Remove JPG Metadata</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Strip EXIF, GPS, and camera details from JPEG uploads before posting or delivery.</p>
          </div>

          <div className="glass-card p-8 group cursor-pointer gsap-reveal hover:border-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Documents</span>
            <h3 className="text-xl font-bold text-white mt-5 mb-3 group-hover:text-blue-400 transition-colors">Clean PDF Metadata</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Remove author, title, producer, and document history from PDFs before sharing.</p>
          </div>

          <div className="glass-card p-8 group cursor-pointer gsap-reveal hover:border-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Privacy</span>
            <h3 className="text-xl font-bold text-white mt-5 mb-3 group-hover:text-blue-400 transition-colors">Remove GPS Position</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Clean location data when the visible image is fine but the hidden coordinates are not.</p>
          </div>

          <div className="glass-card p-8 group cursor-pointer gsap-reveal hover:border-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Audit</span>
            <h3 className="text-xl font-bold text-white mt-5 mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-2">Instant Privacy Score</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Upload any image or document and get a clear 0-100 privacy risk score in seconds.</p>
          </div>

          <div className="glass-card p-8 group cursor-pointer gsap-reveal hover:border-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Design</span>
            <h3 className="text-xl font-bold text-white mt-5 mb-3 group-hover:text-blue-400 transition-colors">Strip PNG Metadata</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Strip text chunks and hidden metadata from exported design or screenshot assets.</p>
          </div>

          <div className="glass-card p-8 group cursor-pointer gsap-reveal hover:border-blue-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Office</span>
            <h3 className="text-xl font-bold text-white mt-5 mb-3 group-hover:text-blue-400 transition-colors">Clean Word Docs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Remove creator and file-level document properties before sending DOCX files.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
