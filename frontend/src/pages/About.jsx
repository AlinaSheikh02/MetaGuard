import { ShieldCheck, EyeOff, FileImage, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gsap-reveal", {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gsap-trigger",
          start: "top 80%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
    <div className="max-w-4xl mx-auto px-4 py-20 relative z-10" ref={containerRef}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24">
        <span className="text-[10px] font-extrabold tracking-widest text-blue-500 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-6 inline-block">The Platform</span>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white">Engineering <span className="text-blue-400">Privacy</span></h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">Your ultimate high-precision toolkit for deep metadata validation and automated media sanitization.</p>
      </motion.div>

      <div className="flex flex-col gap-24 text-slate-300 mb-24 gsap-trigger">
        <div className="gsap-reveal grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-white mb-6 flex items-center gap-2"><span className="w-8 h-px bg-blue-500"></span> What is MetaGuard?</h2>
            <div className="text-base text-slate-400 space-y-4">
              <p className="leading-relaxed">
                MetaGuard is a privacy-first local sandboxing tool designed to protect your personal data online. Modern smartphones and professional software automatically inject invisible digital footprints into the media you create.
              </p>
              <p className="leading-relaxed">
                Without realizing it, uploading a casual photo or a basic PDF can expose highly sensitive information. MetaGuard provides exact analytical visibility and stripping of this data.
              </p>
            </div>
          </div>
          <div className="glass-card p-8 bg-[#0B1120]/80">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Tracked Imprints</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-4"><strong className="text-slate-200 min-w-[120px]">Geolocation</strong><span className="text-slate-500">Exact GPS latitude/longitude</span></li>
              <li className="flex gap-4"><strong className="text-slate-200 min-w-[120px]">Telemetry</strong><span className="text-slate-500">Device model, lens, serial limits</span></li>
              <li className="flex gap-4"><strong className="text-slate-200 min-w-[120px]">Timestamps</strong><span className="text-slate-500">Creation date, mod history</span></li>
              <li className="flex gap-4"><strong className="text-slate-200 min-w-[120px]">Identity</strong><span className="text-slate-500">Author tags, software configs</span></li>
            </ul>
          </div>
        </div>

        <div className="gsap-reveal">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white mb-10 flex items-center gap-2 justify-center"><span className="w-8 h-px bg-blue-500"></span> Core Capabilities <span className="w-8 h-px bg-blue-500"></span></h2>
          <ul className="grid md:grid-cols-3 gap-6">
            <li className="flex flex-col gap-5 p-8 glass-card bg-[#0B1120]/40 group hover:border-blue-500/20 transition-all">
              <ShieldCheck className="w-6 h-6 text-blue-400 stroke-[1.5]" />
              <div>
                <strong className="text-white text-base block mb-2 font-semibold tracking-wide">Audit Score</strong>
                <span className="text-slate-400 text-sm leading-relaxed">Quantify your exact privacy exposure with clear severity matrix levels.</span>
              </div>
            </li>
            <li className="flex flex-col gap-5 p-8 glass-card bg-[#0B1120]/40 group hover:border-blue-500/20 transition-all">
              <EyeOff className="w-6 h-6 text-blue-400 stroke-[1.5]" />
              <div>
                <strong className="text-white text-base block mb-2 font-semibold tracking-wide">Rapid Scrubbing</strong>
                <span className="text-slate-400 text-sm leading-relaxed">Generate completely clean versions of JPG, PNG, PDF, and MS Office lines.</span>
              </div>
            </li>
            <li className="flex flex-col gap-5 p-8 glass-card bg-[#0B1120]/40 group hover:border-blue-500/20 transition-all">
              <FileImage className="w-6 h-6 text-blue-400 stroke-[1.5]" />
              <div>
                <strong className="text-white text-base block mb-2 font-semibold tracking-wide">Strict isolation</strong>
                <span className="text-slate-400 text-sm leading-relaxed">Data lifecycle is contained locally; absolutely zero cloud storage routing.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-16 border-t border-white/[0.05] gsap-reveal">
        <h2 className="text-2xl font-bold mb-12 text-center text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card bg-[#0B1120]/40 p-6 flex flex-col justify-start">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-start gap-3">
                <span className="text-blue-500 font-bold block mt-0.5">Q.</span> {faq.question}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
