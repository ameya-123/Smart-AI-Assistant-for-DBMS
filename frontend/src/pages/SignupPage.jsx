import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Database } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // --- FIX: Redirect to Sign In instead of Tutor ---
        alert("Registration successful! Please sign in to access your workspace.");
        navigate('/signin'); 
      } else {
        setErrorMsg(data.error || 'Failed to sign up');
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      setErrorMsg("Cannot connect to server. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- Unique Mesh Gradient Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/40 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-blue-100/30 blur-[100px]"></div>
      </div>

      {/* --- Signup Card --- */}
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10 transition-all duration-500">
        
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer mb-6">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
               <Database size={22} className="fill-white/20" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">Smart AI Tutor</span>
          </Link>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create account</h2>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm text-center font-bold animate-shake">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600"><User size={18} className="text-gray-400" /></div>
                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none rounded-2xl block w-full pl-12 px-4 py-4 border border-gray-100 bg-gray-50/50 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none sm:text-sm" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600"><Mail size={18} className="text-gray-400" /></div>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none rounded-2xl block w-full pl-12 px-4 py-4 border border-gray-100 bg-gray-50/50 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none sm:text-sm" placeholder="you@university.edu" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600"><Lock size={18} className="text-gray-400" /></div>
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none rounded-2xl block w-full pl-12 px-4 py-4 border border-gray-100 bg-gray-50/50 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-4 px-6 border border-transparent text-sm font-black rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70">
              {loading ? 'Creating Profile...' : 'Start Learning Free'}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account? <Link to="/signin" className="font-bold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;