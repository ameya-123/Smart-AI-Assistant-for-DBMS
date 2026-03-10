import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Send, Plus, Bot, LogOut, Loader2, Sparkles, MessageSquare, 
  Edit, HelpCircle, AlertTriangle, Trash2, Database, Copy, Check, FileText, Download, ChevronDown 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';

// --- IMPORTS FOR SYNTAX HIGHLIGHTING ---
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ==============================
//   MERMAID LIBRARY CONFIGURATION
// ==============================
mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  theme: 'base',
  securityLevel: 'loose',
  logLevel: 'error',
  themeVariables: {
    primaryColor: '#eef2ff',
    edgeLabelBackground: '#ffffff',
    tertiaryColor: '#f9f9f9',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  er: {
    diagramPadding: 20,
    layoutDirection: 'TB',
    minEntityWidth: 100,
    entityPadding: 15,
  },
  flowchart: { 
      curve: 'basis' 
  }
});

// ==============================
//  HELPER COMPONENT: MermaidDiagram
// ==============================
const MermaidDiagram = ({ code }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [renderError, setRenderError] = useState(null);

  useLayoutEffect(() => {
    if (code && ref.current) {
      setRenderError(null);
      const cleanCode = code.trim();
      const id = `mermaid-${uuidv4()}`;
      
      try {
        mermaid.render(id, cleanCode)
          .then((result) => setSvg(result.svg))
          .catch((err) => {
            console.warn("Mermaid Async Render Error:", err.message);
            setRenderError(err.message || "Syntax error in diagram code.");
          });
      } catch (e) {
          console.warn("Mermaid Sync Error:", e.message);
          setRenderError(e.message || "Could not process diagram code.");
      }
    }
  }, [code]);

  if (renderError) {
    return (
        <div className="flex flex-col gap-3 p-4 border border-red-100 bg-red-50/50 rounded-xl mt-2 w-full animate-fade-in">
           <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
               <AlertTriangle size={18} />
               <span>Diagram Render Failed</span>
           </div>
           <p className="text-xs text-gray-500">The AI generated invalid diagram syntax. Raw output:</p>
           <pre className="text-[13px] font-mono bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto text-gray-700 whitespace-pre-wrap break-words">
             {code}
           </pre>
        </div>
    );
  }

  return (
    <div ref={ref} className="mermaid-container overflow-x-auto p-2 bg-white/50 rounded-lg mt-2 transition-all animate-fade-in" dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

// ==============================
//  HELPER COMPONENT: Code Block with Copy
// ==============================
const CodeBlockWithCopy = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-md overflow-hidden shadow-md group relative">
       {language !== 'text' && (
         <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 font-mono uppercase border-b border-gray-700">
           {language}
         </div>
       )}
       <SyntaxHighlighter 
          language={language.toLowerCase() === 'sql' ? 'sql' : language.toLowerCase()} 
          style={vscDarkPlus} 
          wrapLongLines={true}
          customStyle={{ margin: 0, borderRadius: language === 'text' ? '0.375rem' : '0 0 0.375rem 0.375rem', fontSize: '14px', padding: '1rem' }}
       >
        {code}
      </SyntaxHighlighter>
      
      <button 
        onClick={handleCopy} 
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs shadow-sm border border-gray-600"
      >
        {copied ? <><Check size={14} className="text-green-400"/> Copied</> : <><Copy size={14}/> Copy</>}
      </button>
    </div>
  );
};

// ==============================
//    MAIN PAGE COMPONENT
// ==============================
const ChatInterfacePage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null); 
  const [showExportMenu, setShowExportMenu] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null); // Feedback for global copy

  const fetchUserSessions = useCallback(async (idStr) => {
      if (!idStr) return;
      try {
          const response = await fetch(`http://localhost:5000/api/sessions/${idStr}`);
          if (response.ok) {
              const data = await response.json();
              setChatSessions(data);
          }
      } catch (error) {
          console.error("Failed to fetch sessions:", error);
      }
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const storedSkill = localStorage.getItem('userSkillLevel');
    
    if (!storedId || !storedName) {
      navigate('/signin');
    } else {
      setUserId(storedId);
      setUserName(storedName);
      setSkillLevel(storedSkill || 'beginner');
      resetUIForNewChat(storedName, storedSkill);
      fetchUserSessions(storedId);
    }
  }, [navigate, fetchUserSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const resetUIForNewChat = (name = userName, skill = skillLevel) => {
     setMessages([{
       role: 'ai',
       id: 'welcome-msg',
       content: `Hello ${name || 'there'}! I'm your Smart AI Tutor for DBMS. I have adjusted my explanations to your ${skill || 'beginner'} level. What database concept would you like to learn today?`
     }]);
     setActiveSessionId(null);
  };

  const handleNewChatClick = () => resetUIForNewChat();

  const handleGlobalCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation(); 
    if (isDeleting || !window.confirm("Are you sure you want to delete this chat?")) return;

    setIsDeleting(sessionId);
    try {
        const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, { method: 'DELETE' });
        if (response.ok) {
            setChatSessions(prev => prev.filter(session => session.id !== sessionId));
            if (activeSessionId === sessionId) resetUIForNewChat();
        } else alert("Failed to delete session.");
    } catch (error) {
        console.error("Error deleting:", error);
        alert("Error connecting to server.");
    } finally {
        setIsDeleting(null);
    }
  };

  const loadHistorySession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setIsLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/messages`);
        if (response.ok) {
            const dbMessages = await response.json();
            setMessages(dbMessages);
        } else throw new Error("Failed to fetch messages");
    } catch (error) {
        console.error("API Error:", error);
        setMessages([{ role: 'ai', content: "Error loading session history.", id: uuidv4() }]);
    } finally {
        setIsLoading(false);
    }
  }

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessageContent, id: uuidv4() }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessageContent,
          user_id: userId,
          skill_level: skillLevel,
          session_id: activeSessionId
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (activeSessionId === null && data.session_id) {
             setActiveSessionId(data.session_id);
             fetchUserSessions(userId);
        }
        setMessages(prev => [...prev, { role: 'ai', content: data.answer, id: data.message_id || uuidv4() }]);
      } else throw new Error(data.error || "Server error");
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't connect to the server.", id: uuidv4() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportReport = async (content, format) => {
    const endpoint = format === 'pdf' ? 'generate-report' : 'generate-report-word';
    const extension = format === 'pdf' ? 'pdf' : 'docx';
    
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName,
          topic: "DBMS Lab Report",
          content: content
        }),
      });

      if (!response.ok) throw new Error(`${format.toUpperCase()} Generation Failed`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${new Date().getTime()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setShowExportMenu(null); 
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const renderMessageContent = (content, msgId) => {
    const reportKeywords = [/AIM:/i, /TITLE:/i, /EXPERIMENT NAME:/i, /CONCLUSION:/i, /THEORY:/i];
    const isReport = reportKeywords.some(regex => regex.test(content));

    const mermaidMatch = content.match(/```mermaid\n([\s\S]*?)\n```/);
    if (mermaidMatch) return <MermaidDiagram code={mermaidMatch[1]} />;

    const MarkdownComponents = {
      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-3 mb-2 text-gray-900" {...props} />,
      p: ({node, ...props}) => <p className="mb-2 text-gray-800" {...props} />,
      strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
      li: ({node, ...props}) => <li className="mb-1" {...props} />,
      code: ({node, inline, ...props}) => 
        inline ? <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-700" {...props} /> : <code {...props} />
    };

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textPart = content.substring(lastIndex, match.index);
        parts.push(
          <ReactMarkdown key={`text-${lastIndex}`} components={MarkdownComponents}>
            {textPart}
          </ReactMarkdown>
        );
      }
      
      parts.push(
        <CodeBlockWithCopy 
          key={`code-${match.index}`} 
          language={match[1] || 'text'} 
          code={match[2]} 
        />
      );
      
      lastIndex = codeBlockRegex.lastIndex;
    }
    
    if (lastIndex < content.length) {
      const textPart = content.substring(lastIndex);
      parts.push(
        <ReactMarkdown key={`text-${lastIndex}`} components={MarkdownComponents}>
          {textPart}
        </ReactMarkdown>
      );
    }

    const finalParts = parts.length === 0 ? <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown> : parts;

    return (
      <div className="flex flex-col relative group">
        {finalParts}
        {isReport && (
          <div className="mt-6 pt-4 border-t border-indigo-100 flex items-center justify-between animate-fade-in relative">
             <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
               <FileText size={14} /> Academic Report Ready
             </div>
             
             <div className="relative">
                <button 
                    onClick={() => setShowExportMenu(showExportMenu === msgId ? null : msgId)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 group"
                >
                    Export As <ChevronDown size={14} className={`transition-transform duration-200 ${showExportMenu === msgId ? 'rotate-180' : ''}`} />
                </button>

                {showExportMenu === msgId && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                        <button 
                            onClick={() => handleExportReport(content, 'pdf')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-50"
                        >
                            <FileText size={16} className="text-red-500" /> PDF Document
                        </button>
                        <button 
                            onClick={() => handleExportReport(content, 'word')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            <Download size={16} className="text-blue-500" /> Word Document
                        </button>
                    </div>
                )}
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <div className="hidden md:flex w-[260px] bg-[#f9f9f9] border-r border-gray-200 flex-col transition-all font-medium shrink-0">
        <div className="p-4 flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-indigo-700" />
            <span className="font-bold text-gray-900 text-[15px]">Smart AI Tutor</span>
          </div>
          <Edit size={18} className="text-gray-400 hover:text-gray-700 cursor-pointer" />
        </div>
        
        <div className="px-3 pb-2">
          <button onClick={handleNewChatClick} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-3 rounded-xl text-[15px] font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus size={18} /> New chat
          </button>
        </div>

        <div className="px-3 pb-4 border-b border-gray-200">
          <Link to="/sandbox" className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-3 py-2.5 rounded-xl text-[14px] font-semibold shadow-sm transition-all mt-2 group">
            <Database size={16} className="text-indigo-600 group-hover:scale-110 transition-transform" /> Practice SQL
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 relative scrollbar-thin scrollbar-thumb-gray-300">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 top-0 bg-[#f9f9f9] sticky pt-2 z-10">Recent history</p>
          <div className="px-2 space-y-1 pb-4">
            {chatSessions.length === 0 ? (
                 <p className="text-sm text-gray-400 px-4 italic mt-4">No recent chats.</p>
            ) : (
                chatSessions.map((session) => (
                    <div key={session.id} className={`group flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm transition-colors animate-fade-in ${activeSessionId === session.id ? 'bg-gray-200/80 text-gray-900' : 'hover:bg-gray-200/50 text-gray-700'}`}>
                        <button onClick={() => loadHistorySession(session.id)} className="flex items-center gap-3 flex-1 overflow-hidden text-left">
                          <MessageSquare size={18} className={`shrink-0 transition-colors ${activeSessionId === session.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                          <span className="truncate">{session.title}</span>
                        </button>
                        <button onClick={(e) => handleDeleteSession(e, session.id)} disabled={isDeleting === session.id} className={`shrink-0 p-1.5 rounded-md text-gray-400 hover:bg-red-100 hover:text-red-600 transition-all ${isDeleting === session.id ? 'opacity-50 cursor-wait' : 'opacity-0 group-hover:opacity-100'}`} title="Delete Chat">
                             {isDeleting === session.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                    </div>
                ))
            )}
          </div>
        </div>
        
        <div className="p-3 border-t border-gray-200 bg-[#f9f9f9]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg hover:bg-gray-200/50 cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold shrink-0 shadow-sm group-hover:shadow-md transition-all">
              {userInitial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{userName || 'Test User'}</p>
              <p className="text-xs text-indigo-600 font-medium capitalize truncate">{skillLevel} Level</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-0 py-8 scroll-smooth pb-48 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg, index) => {
              const hasMermaid = msg.content.includes('```mermaid');
              const messageId = msg.id || index;
              return (
              <div key={messageId} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up relative group`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-[#f4f4f5] border border-gray-200 flex items-center justify-center text-indigo-600 shrink-0 mt-1"><Sparkles size={16} /></div>
                )}
                
                <div className={`px-6 py-4 rounded-[1.5rem] max-w-[85%] shadow-sm relative ${
                  msg.role === 'user' ? 'bg-[#eef2ff] border border-indigo-100 text-gray-800 rounded-tr-md' : 'bg-[#f9f9f9] border border-gray-100 text-gray-800 rounded-tl-md'
                } ${hasMermaid ? 'w-full' : ''}`}>
                  
                  {/* --- GLOBAL COPY BUTTON FOR THE ENTIRE BUBBLE (Theory + SQL) --- */}
                  <button 
                    onClick={() => handleGlobalCopy(msg.content, messageId)} 
                    className={`absolute top-2 right-4 p-1.5 rounded-lg bg-white/80 border border-gray-200 transition-all shadow-sm hover:bg-white active:scale-95 z-30 ${copiedMessageId === messageId ? 'text-green-600 border-green-200' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600'}`}
                    title="Copy response"
                  >
                    {copiedMessageId === messageId ? <Check size={14} /> : <Copy size={14} />}
                  </button>

                  <div className="text-[16px] leading-relaxed">
                    {renderMessageContent(msg.content, messageId)}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold shrink-0 mt-1 shadow-sm">{userInitial}</div>
                )}
              </div>
            )})}
            {isLoading && (
              <div className="flex gap-4 justify-start animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-[#f4f4f5] border border-gray-200 flex items-center justify-center text-indigo-600 shrink-0 mt-1"><Sparkles size={16} /></div>
                <div className="px-5 py-4 rounded-2xl bg-[#f9f9f9] border border-gray-100 flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white via-80% to-transparent pt-10 pb-6 md:pb-8 z-20">
          <div className="max-w-3xl mx-auto px-4 md:px-0 relative group font-medium">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-30 transition duration-1000"></div>
            <form onSubmit={handleSendMessage} className="relative flex items-end bg-white border-2 border-gray-200 rounded-[2rem] shadow-lg overflow-hidden focus-within:border-indigo-500 transition-all pl-6 pr-4 py-4 z-10">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message Smart AI Tutor..." className="w-full max-h-48 min-h-[60px] md:min-h-[80px] bg-transparent text-gray-900 placeholder-gray-400 outline-none resize-none text-lg leading-relaxed" rows={1} disabled={isLoading} />
              <div className="shrink-0 ml-4 pb-1">
                <button type="submit" disabled={!input.trim() || isLoading} className={`p-4 rounded-full flex items-center justify-center transition-all shadow-md ${input.trim() && !isLoading ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="ml-0.5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfacePage;