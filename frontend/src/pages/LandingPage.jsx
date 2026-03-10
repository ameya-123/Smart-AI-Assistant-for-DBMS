import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Database, 
  Layout, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setChatStep(1), 1000),
      setTimeout(() => setChatStep(2), 2500),
      setTimeout(() => setChatStep(3), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleAskAiDemo = () => {
    if (!inputValue.trim()) return;
    setIsInputLoading(true);
    setTimeout(() => {
      navigate('/signup');
      setIsInputLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-purple-100/40 blur-3xl mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <svg className="absolute left-0 top-0 h-full w-full opacity-20" aria-hidden="true">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M.5 60V.5H60" fill="none" stroke="currentColor" className="text-indigo-100" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* --- Navigation Bar (Features, How it Works, About removed) --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white/70 backdrop-blur-xl z-50 relative border-b border-indigo-50/50">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
            <Database size={22} className="fill-white/20" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Smart AI Tutor</span>
        </div>
        
        {/* Empty Div to keep the logo on the left */}
        <div className="hidden md:block"></div>
      </nav>

      {/* --- Main Hero Section --- */}
      <main className="max-w-7xl mx-auto px-8 md:px-16 pt-16 md:pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 space-y-8 text-center lg:text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-sm">
            <GraduationCap size={14} /> Based on Silberschatz Curriculum
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
            Master with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Academic Precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Your personal AI thought partner for Database Systems. Quit generic chatbots. Get logic-driven analogies and instant E-R modeling.
          </p>
          
          <div className="w-full max-w-lg relative group mx-auto lg:mx-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-2xl p-1.5 pl-5 shadow-xl ring-1 ring-gray-900/5 border border-gray-100">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAiDemo()}
                placeholder='Try: "Explain 3NF like I am 5"'
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg font-medium"
              />
              <button
                onClick={handleAskAiDemo}
                className="ml-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 min-w-[120px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
              >
                {isInputLoading ? <Loader2 size={20} className="animate-spin" /> : <>Ask AI <Sparkles size={18} /></>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Content: Browser Mockup */}
        <div className="flex-1 w-full relative perspective-2000">
          <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-3 shadow-2xl border border-white/40 transform lg:rotate-y-12 transition-all duration-700">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100/50">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="flex-1 text-center text-[10px] text-gray-400 ml-2 bg-gray-100/50 rounded py-1 font-mono uppercase tracking-widest">query_session.sql</div>
            </div>

            <div className="bg-white rounded-b-[2rem] p-6 min-h-[400px] flex flex-col">
              <div className={`flex items-start justify-end gap-3 mb-8 transition-all duration-500 ${chatStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="p-4 bg-indigo-600 text-white rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-md">
                  What is the difference between a Primary Key and a Foreign Key?
                </div>
              </div>

              <div className={`flex items-start gap-3 mb-6 transition-all duration-500 ${chatStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">AI</div>
                <div className="p-5 bg-gray-50 rounded-2xl rounded-tl-none text-sm text-gray-700 border border-gray-100 shadow-sm leading-relaxed">
                   <strong>Analogy:</strong> A Primary Key is your unique ID card. A Foreign Key is that same ID on a library book checkout record.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Feature Grid --- */}
      <section className="bg-white py-24 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              id="core-concepts"
              icon={<BookOpen size={24} />}
              title="Core Concepts"
              desc="Master the fundamental building blocks of DBMS logic to ensure exam success."
              delay="0s"
            />
            <FeatureCard 
              id="query-lab"
              icon={<ShieldCheck size={24} />}
              title="Query Lab"
              desc="Real-time feedback on your queries. Learn constraints and syntax instantly in a safe sandbox."
              isHighlighted={true}
              delay="0.1s"
            />
            <FeatureCard 
              id="schema-mapper"
              icon={<Layout size={24} />}
              title="Schema Mapper"
              desc="AI generates live E-R diagrams. Visualize your database architecture and relationships instantly."
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      <footer className="py-16 text-center bg-gray-50 border-t border-gray-100">
        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.3em]">
          © 2026 Smart AI Tutor — Powered by Silberschatz Theory
        </p>
      </footer>
    </div>
  );
};

// --- Reusable Feature Card Component ---
const FeatureCard = ({ id, icon, title, desc, isHighlighted, delay }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/features/${id}`)}
      className={`group cursor-pointer bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 animate-fade-in-up relative overflow-hidden ${isHighlighted ? 'border-indigo-100 shadow-indigo-100/50' : ''}`}
      style={{ animationDelay: delay }}
    >
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-10 transition-all duration-500 ${isHighlighted ? 'bg-indigo-600 text-white shadow-xl' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-5">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm mb-8 font-medium">{desc}</p>
      
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
        Explore Module <ArrowRight size={16} />
      </div>

      {isHighlighted && (
        <div className="absolute inset-0 bg-indigo-50/10 -z-10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
    </div>
  );
};

export default LandingPage;