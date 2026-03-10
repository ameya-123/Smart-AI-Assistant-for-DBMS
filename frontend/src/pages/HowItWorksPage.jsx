import React from 'react';
import { BiMessageDetail, BiLoaderCircle, BiTerminal, BiCodeAlt } from 'react-icons/bi';
import { HiArrowNarrowRight, HiSparkles, HiOutlineCube, HiOutlineLightningBolt } from 'react-icons/hi';
import { CheckCircle2, Database, Search, FileText } from 'lucide-react';

const StepCard = ({ number, title, description, children }) => (
  <div className="flex flex-col items-center text-center bg-white p-10 rounded-[2.5rem] border border-gray-100 z-10 h-full relative transition-all duration-500 hover:shadow-2xl group">
    <div className="absolute -top-6 bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-xl border-4 border-white">
      {number}
    </div>
    
    <div className="w-full min-h-[200px] flex items-center justify-center mb-8 mt-4">
        {children}
    </div>

    <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

// --- Expanded Visual Flow Components ---

const VisualStep1 = () => (
  <div className="w-full max-w-[280px] space-y-3">
    <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 transform -rotate-2 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <BiMessageDetail size={20} className="text-indigo-600" />
        <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
      </div>
    </div>
    <div className="bg-indigo-600 rounded-2xl p-4 shadow-xl translate-x-4 rotate-2 text-white flex items-center gap-3">
      <HiSparkles size={20} />
      <div className="h-2 w-32 bg-indigo-400 rounded-full"></div>
    </div>
  </div>
);

const VisualStep2 = () => (
  <div className="relative flex flex-col items-center p-8 bg-gray-50 rounded-[3rem] border border-gray-100 w-full max-w-[240px]">
    <div className="relative z-10 flex flex-col items-center gap-4">
      <BiLoaderCircle size={48} className="text-indigo-500 animate-spin" />
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center"><Search size={16} className="text-blue-500" /></div>
        <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center"><Database size={16} className="text-emerald-500" /></div>
        <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center"><FileText size={16} className="text-orange-500" /></div>
        <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center"><BiCodeAlt size={16} className="text-purple-500" /></div>
      </div>
    </div>
    {/* Floating particles to simulate "Analysis" */}
    <div className="absolute top-4 left-4 h-2 w-2 bg-indigo-400 rounded-full animate-ping"></div>
    <div className="absolute bottom-10 right-6 h-2 w-2 bg-purple-400 rounded-full animate-ping delay-300"></div>
  </div>
);

const VisualStep3 = () => (
  <div className="space-y-4 w-full max-w-[260px]">
    {/* SQL Result Mockup */}
    <div className="bg-[#1e293b] rounded-2xl p-4 shadow-xl border border-gray-700 font-mono scale-95 origin-bottom">
      <div className="flex gap-1 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
      </div>
      <div className="space-y-1.5">
        <div className="h-1 w-full bg-gray-600 rounded"></div>
        <div className="h-1 w-2/3 bg-gray-600 rounded"></div>
        <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-bold uppercase tracking-tighter">
            <CheckCircle2 size={10} /> Validated Query
        </div>
      </div>
    </div>
    {/* Diagram Mockup */}
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center justify-center gap-3 scale-105">
      <HiOutlineCube size={20} className="text-indigo-600" />
      <div className="h-[1px] w-8 bg-indigo-200"></div>
      <HiOutlineCube size={20} className="text-purple-600" />
    </div>
  </div>
);

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-50">
      <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-28">
          <h2 className="text-5xl font-black text-gray-900 mb-8 tracking-tight">
            How SMART AI TUTOR Works
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            A precise agentic workflow that converts natural language into academic database mastery.
          </p>
        </div>

        <div className="relative">
          {/* Background Flow Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-100 to-transparent -translate-y-1/2 z-0">
             <div className="absolute top-0 left-0 h-full w-24 bg-indigo-400 blur-sm animate-[loading_3s_linear_infinite]"></div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex-1">
              <StepCard 
                number="1" 
                title="Input Intent" 
                description="The student submits a complex DBMS query or theoretical question via natural language."
              >
                <VisualStep1 />
              </StepCard>
            </div>

            {/* Step 2 */}
            <div className="flex-1">
              <StepCard 
                number="2" 
                title="Agentic Reasoning" 
                description="The AI agent breaks down the intent, searching textbooks and selecting the right visualization tools."
              >
                <VisualStep2 />
              </StepCard>
            </div>

            {/* Step 3 */}
            <div className="flex-1">
              <StepCard 
                number="3" 
                title="Academic Output" 
                description="The system delivers a validated SQL block, an E-R diagram, or a theory-grounded explanation."
              >
                <VisualStep3 />
              </StepCard>
            </div>
          </div>
        </div>

        {/* Bottom Feature Bar */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-gray-100">
           {[
             { icon: <Search />, text: "Context Aware" },
             { icon: <Database />, text: "Live Validation" },
             { icon: <BiTerminal />, text: "Code Generation" },
             { icon: <HiOutlineLightningBolt />, text: "Instant Results" }
           ].map((item, idx) => (
             <div key={idx} className="flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">{item.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.text}</span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;