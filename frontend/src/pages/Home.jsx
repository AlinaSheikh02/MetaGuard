import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Shield, CheckCircle, AlertTriangle, FileText, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareSafe, setShareSafe] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const handleFileInput = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    // Some browsers use empty string or different mimetypes for office docs, so we also rely on extension in backend
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx', 'pptx'];

    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(extension)) {
      setError('Please upload a valid image (JPG, PNG) or document (PDF, DOCX, XLSX, PPTX).');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview('document'); // Special string to indicate it's a doc
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('share_safe', shareSafe);

    const headers = {};
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      // Navigate to report page with the returned data
      navigate(`/report/${data.id}`, { state: { report: data } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Background gradients */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight mb-4 text-white">
              Protect Your Privacy Before You Post
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Upload any image to analyze hidden metadata, reveal geolocation risks, and instantly sanitize your photo.
            </p>
          </motion.div>
        </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8 md:p-12 mb-8"
      >
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${file ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="flex flex-col items-center">
              {preview === 'document' ? (
                <div className="w-48 h-48 mb-6 rounded-lg border border-slate-700 bg-slate-800/50 flex items-center justify-center flex-col shrink-0">
                  <FileText className="w-16 h-16 text-blue-400 mb-2" />
                  <span className="text-slate-400 text-sm font-medium">{file.name.split('.').pop().toUpperCase()}</span>
                </div>
              ) : (
                <div className="relative w-48 h-48 mb-6 rounded-lg overflow-hidden border border-slate-700 shadow-xl shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                    <Shield className="text-green-400 w-6 h-6" />
                  </div>
                </div>
              )}
              <p className="text-lg font-medium mb-2">{file.name}</p>
              <p className="text-sm text-slate-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

              {file.type.startsWith('image/') && (
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
                <button onClick={() => { setFile(null); setPreview(null); }} className="px-6 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                  Clear
                </button>
                <button onClick={handleUpload} disabled={loading} className="glass-button flex items-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 animate-bounce" /> Analyzing...
                    </span>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" /> Analyze Image
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-xl font-medium mb-2">Drag & Drop a File</p>
              <p className="text-slate-400 mb-6 font-light">Supports JPG, PNG, PDF, DOCX, XLSX, PPTX</p>
              <label className="glass-button cursor-pointer">
                <span>Browse Files</span>
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.pptx" onChange={handleFileInput} />
              </label>
            </div>
          )}
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
      <div className="mt-24 pt-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest text-slate-500 uppercase">How It Works</span>
          <h2 className="text-3xl font-semibold text-white mt-3 mb-4 tracking-tight">Clean in three steps. No noise, no friction.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-500/20 p-4 rounded-2xl text-blue-400 mb-4 border border-blue-500/30">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Upload</h3>
            <p className="text-slate-400">Drop your file into our secure area. It never gets uploaded to any public servers.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-amber-500/20 p-4 rounded-2xl text-amber-400 mb-4 border border-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Audit</h3>
            <p className="text-slate-400">We scan the file and show you exactly what hidden info is lurking inside.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-500/20 p-4 rounded-2xl text-green-400 mb-4 border border-green-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Cleanse</h3>
            <p className="text-slate-400">Get a safe, clean copy of your file with all the hidden data removed.</p>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-8 border-y border-slate-800/50 py-8 bg-slate-900/20">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-400" />
          <span className="text-lg font-medium text-slate-200">100% Private - Files never stored</span>
        </div>
        <div className="hidden md:block w-px h-8 bg-slate-800"></div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-blue-400" />
          <span className="text-lg font-medium text-slate-200">Completely Free - No limits</span>
        </div>
      </div>

      {/* Top Tasks Features Section */}
      <div className="mt-16 pt-12 pb-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest text-slate-500 uppercase">Top Tasks</span>
          <h2 className="text-3xl font-semibold text-white mt-3 mb-4">Start with the exact metadata cleanup task you need.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">These are the highest-intent workflows MetaGuard supports today. Choose the page that matches your file type or sharing problem.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-blue-400 tracking-wider">IMAGES</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-blue-400 transition-colors">Remove JPG Metadata</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Strip EXIF, GPS, and camera details from JPEG uploads before posting or delivery.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-blue-400 tracking-wider">DOCUMENTS</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-blue-400 transition-colors">Clean PDF Metadata</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Remove author, title, producer, and document history from PDFs before sharing.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-blue-400 tracking-wider">PRIVACY</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-blue-400 transition-colors">Remove GPS From Photos</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Clean location data when the visible image is fine but the hidden coordinates are not.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-blue-400 tracking-wider">AUDIT</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2 flex items-center gap-2 group-hover:text-blue-400 transition-colors">📊 Instant Privacy Score</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Upload any image or document and get a clear 0-100 privacy risk score in seconds. Know exactly how safe your file is before sharing.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-blue-400 tracking-wider">DESIGN</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-blue-400 transition-colors">Remove PNG Metadata</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Strip text chunks and hidden metadata from exported design or screenshot assets.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-blue-400 tracking-wider">OFFICE</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-blue-400 transition-colors">Clean Word Docs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Remove creator and file-level document properties before sending DOCX files externally.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
