import { ShieldCheck, EyeOff, FileImage, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function About() {
  const faqs = [
    {
      question: "Can I trust the cleaned files are actually metadata-free?",
      answer: "Yes. We use industry-standard libraries (Pillow for images, PyPDF2/python-docx for documents) with verified metadata removal functions. Every cleaned file gets re-scanned to confirm zero risky metadata remains."
    },
    {
      question: "What specific metadata does MetaGuard remove?",
      answer: "We proactively strip GPS coordinates, timestamps, camera make/model, lens parameters, logged-in software usernames, author identifiers, and editing history from your files."
    },
    {
      question: "What exactly is EXIF data?",
      answer: "EXIF stands for Exchangeable Image File Format. It's automatically embedded into photos by your smartphone or camera, and it records details like your GPS coordinates, camera make/model, orientation, and the exact date and time the photo was taken."
    },
    {
      question: "Are office documents a privacy risk?",
      answer: "Yes! A seemingly harmless Word document or PDF usually tracks its 'Author', 'Creator', 'Last Modified By' usernames, total editing time, and software versions. MetaGuard strips all these from DOCX, XLSX, PPTX, and PDF formats."
    },
    {
      question: "Do you store the uploaded files?",
      answer: "No. This tool is built entirely around privacy. While MetaGuard analyzes your files, it immediately cleans them and only saves your score in a strictly local database on your own machine. We do not extract or upload your photos to external servers."
    },
    {
      question: "What does 'Share-safe Mode' do?",
      answer: "Standard cleaning leaves the image's original dimensions and heavy filesize intact. 'Share-safe Mode' not only scrubs all invisible metadata but compresses the image to a social-media standard 1080p JPEG layout, eliminating sneaky hidden tags sometimes nested in higher-quality formats (like specific PNG chunks)."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl font-semibold tracking-tight mb-4 text-white">About MetaGuard</h1>
        <p className="text-xl text-slate-400">Your ultimate toolkit for image and document privacy validation.</p>
      </motion.div>

      <div className="flex flex-col gap-20 text-slate-300 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-3xl font-bold mb-6 text-white pb-3 border-b border-slate-800">What is MetaGuard?</h2>
          <div className="text-lg">
            <p className="mb-4 leading-relaxed text-slate-400">
              MetaGuard is a privacy-first sandboxing tool designed to protect your personal data online.
              Modern smartphones and professional software automatically inject invisible digital footprints into the media you create.
              Without realizing it, uploading a casual photo or a basic PDF can expose highly sensitive information to the public.
            </p>
            <p className="mb-4 leading-relaxed text-slate-400">
              When you upload a file to MetaGuard, it dissects the embedded data. Here is exactly what data comes under metadata that we look for:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-3 text-blue-300">
              <li><strong className="text-slate-300">Geo-location Data:</strong> Exact GPS coordinates (Latitude & Longitude) of where a photo was taken.</li>
              <li><strong className="text-slate-300">Device Telemetry:</strong> Camera and phone Make, Model, serial numbers, and specific lens parameters.</li>
              <li><strong className="text-slate-300">Timestamps:</strong> The exact date, time, and timezone of creation or modification.</li>
              <li><strong className="text-slate-300">Author & Ownership Identifiers:</strong> Logged-in usernames, software versions, and creator names injected into Office Documents and PDFs.</li>
            </ul>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold mb-8 text-white pb-3 border-b border-slate-800">Our Features</h2>
          <ul className="grid md:grid-cols-3 gap-6">
            <li className="flex flex-col gap-4 p-6 bg-slate-800/20 rounded-xl border border-slate-800 shadow-md">
              <ShieldCheck className="w-8 h-8 text-green-400" />
              <div>
                <strong className="text-white text-xl block mb-2">Audit Score</strong>
                <span className="text-slate-400">Read hidden metadata and understand your exact privacy exposure with clear severity levels.</span>
              </div>
            </li>
            <li className="flex flex-col gap-4 p-6 bg-slate-800/20 rounded-xl border border-slate-800 shadow-md">
              <EyeOff className="w-8 h-8 text-blue-400" />
              <div>
                <strong className="text-white text-xl block mb-2">Rapid Sanitization</strong>
                <span className="text-slate-400">Quickly generate 100% clean versions of JPG, PNG, PDF, DOCX, XLSX, and PPTX files.</span>
              </div>
            </li>
            <li className="flex flex-col gap-4 p-6 bg-slate-800/20 rounded-xl border border-slate-800 shadow-md">
              <FileImage className="w-8 h-8 text-amber-400" />
              <div>
                <strong className="text-white text-xl block mb-2">Local Processing</strong>
                <span className="text-slate-400">Your data stays private in a sandbox environment to protect you entirely without cloud footprinting.</span>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-8 border-t border-slate-800">
        <h2 className="text-4xl font-bold mb-10 text-center text-white flex items-center justify-center gap-3">
          <HelpCircle className="w-10 h-10 text-blue-500" /> Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 shadow-sm flex flex-col justify-start">
              <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-black">Q.</span> {faq.question}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
