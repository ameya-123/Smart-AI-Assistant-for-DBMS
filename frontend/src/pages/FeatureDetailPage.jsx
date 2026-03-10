import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, ShieldCheck, Layout as LayoutIcon, 
  CheckCircle2, Database, GitBranch, Layers, Terminal,
  Cpu, Zap, Globe, Info, MousePointer2, ChevronRight
} from 'lucide-react';

const FEATURE_DETAILS = {
  'core-concepts': {
    title: "Core Concepts",
    icon: <BookOpen className="text-blue-600" size={32} />,
    tagline: "Theoretical Mastery",
    description: "Deep-dive into the formal structures of Database Systems. We simplify high-level abstractions into digestible, exam-ready logic using the Silberschatz standard.",
    details: [
      { h: "Relational Algebra", p: "Master Select, Project, Join, and Set operations—the math behind SQL." },
      { h: "Normal Forms", p: "Step-by-step guidance through 1NF, 2NF, 3NF, and BCNF to ensure zero data redundancy." },
      { h: "Transaction Logic", p: "Understand ACID properties: Atomicity, Consistency, Isolation, and Durability." },
      { h: "Storage Engines", p: "Learn how B+ Trees and Hashing optimize data retrieval on physical disks." }
    ],
    interactiveVisual: (
      <div className="space-y-6">
        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
             <Info size={16} className="text-blue-600" />
             <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Logic Insight</span>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed font-medium">
            Normalization isn't just about saving space; it's about protecting data integrity against insertion and deletion anomalies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {["Relational Schema", "Tuple Calculus", "Functional Dependencies"].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-300 transition-colors cursor-help group">
              <span className="text-sm font-semibold text-gray-700">{item}</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  'query-lab': {
    title: "Query Lab",
    icon: <ShieldCheck className="text-indigo-600" size={32} />,
    tagline: "Execution Sandbox",
    description: "Practice makes perfect. Our Query Lab provides a real-time SQLite environment where you can execute queries and see instant results without setting up a server.",
    details: [
      { h: "Live Execution", p: "Run standard SQL queries against a pre-loaded academic dataset." },
      { h: "Logic Validation", p: "The AI agent checks your WHERE clauses and JOIN conditions for logical traps." },
      { h: "Execution Plans", p: "Visualize how the database engine traverses indexes to find your data." },
      { h: "Constraint Testing", p: "Intentionally trigger Primary Key and Foreign Key violations to see how DBs react." }
    ],
    interactiveVisual: (
      <div className="bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-gray-800 font-mono overflow-hidden">
        <div className="bg-[#1e293b] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Query_Console_v2</span>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex gap-3 text-sm">
            <span className="text-indigo-400 font-bold">SELECT</span>
            <span className="text-white">instructor_name</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-indigo-400 font-bold">FROM</span>
            <span className="text-emerald-400">Department</span>
          </div>
          <div className="flex gap-3 text-sm border-b border-gray-800 pb-6">
            <span className="text-indigo-400 font-bold">WHERE</span>
            <span className="text-white">budget &gt; 50000;</span>
          </div>
          <div className="flex items-center gap-3 pt-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-emerald-400 font-bold text-xs tracking-widest uppercase">Agent Validated: No Errors</span>
          </div>
        </div>
      </div>
    )
  },
  'schema-mapper': {
    title: "Schema Mapper",
    icon: <LayoutIcon className="text-blue-600" size={32} />,
    tagline: "Visual Architecture",
    description: "Convert text-based DDL into professional Entity-Relationship diagrams instantly using AI-driven Mermaid.js rendering.",
    details: [
      { h: "Auto-Mapping", p: "Simply describe your tables and the AI draws the links automatically." },
      { h: "Crow's Foot Notation", p: "Standardized visual symbols for One-to-Many and Many-to-Many links." },
      { h: "Schema Export", p: "Download your E-R diagrams for project documentation or study guides." },
      { h: "Constraint Sync", p: "Watch relationship lines appear instantly when you define a Foreign Key." }
    ],
    interactiveVisual: (
      <div className="p-10 bg-white border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center min-h-[350px] group cursor-crosshair">
        
        <div className="mt-10 flex flex-wrap justify-center gap-3">
           <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase">Primary Key Detected</span>
           <span className="px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-[10px] font-bold text-purple-600 uppercase">Foreign Key Link</span>
        </div>
        <div className="mt-6 flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase animate-bounce">
           <MousePointer2 size={12} /> Click tables to expand attributes
        </div>
      </div>
    )
  }
};

const FeatureDetailPage = () => {
  const { featureId } = useParams();
  const feature = FEATURE_DETAILS[featureId];

  if (!feature) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-10 font-sans">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center text-gray-300">
         <Database size={32} />
      </div>
      <h1 className="text-xl font-black text-gray-900 mb-2">Feature Not Found</h1>
      <Link to="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all uppercase text-xs tracking-widest">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      {/* --- Simple Navigation --- */}
      <nav className="max-w-7xl mx-auto px-8 py-12">
        <Link to="/" className="group inline-flex items-center gap-3 text-[11px] font-black text-gray-400 hover:text-indigo-600 tracking-[0.3em] transition-all">
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
          BACK_TO_HOME
        </Link>
      </nav>

      {/* --- Core Content --- */}
      <main className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-start pb-32">
        
        {/* Left: Deep Info */}
        <div className="space-y-16 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-6">
            <div className="p-5 bg-indigo-50 text-indigo-600 rounded-2xl w-fit shadow-inner">
               {feature.icon}
            </div>
            <span className="block text-indigo-600 font-black text-sm uppercase tracking-[0.4em]">
               Module // {feature.tagline}
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 leading-[0.95]">
              {feature.title}
            </h1>
            <p className="text-2xl text-gray-500 leading-relaxed font-medium max-w-xl">
              {feature.description}
            </p>
          </div>

          {/* Expanded Features Grid */}
          <div className="space-y-6 pt-12 border-t border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
               <Zap size={14} className="text-indigo-500" /> Deep Dive Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feature.details.map((detail, idx) => (
                <div key={idx} className="group p-6 bg-gray-50 rounded-[2rem] border border-gray-50 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{detail.h}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{detail.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Visual (Sticky) */}
        <div className="sticky top-12 pt-12 lg:pt-0 animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">
           <div className="absolute inset-0 bg-indigo-100/40 blur-[120px] -z-10 rounded-full transform scale-150"></div>
           <div className="bg-white p-4 rounded-[4rem] border border-gray-100 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] relative overflow-hidden">
              <div className="bg-gray-50/50 p-12 rounded-[3rem] border border-gray-50 min-h-[500px] flex flex-col justify-center">
                 {feature.interactiveVisual}
              </div>
           </div>
           
           <div className="mt-12 flex justify-center gap-10">
              <div className="flex items-center gap-2 text-gray-300 font-bold text-[11px] uppercase tracking-widest">
                 <Globe size={16} /> Global CDN
              </div>
              <div className="flex items-center gap-2 text-gray-300 font-bold text-[11px] uppercase tracking-widest">
                 <Database size={16} /> SQLite Native
              </div>
           </div>
        </div>
      </main>

      {/* --- Simplified Minimal Footer --- */}
      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-gray-50 mt-12 text-center">
         <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.5em] mb-4">
           Smart AI Tutor • Education Engine 2026 • Optimized for Silberschatz Curriculum
         </p>
      </footer>
    </div>
  );
};

export default FeatureDetailPage;