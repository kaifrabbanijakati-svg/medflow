import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-12 rounded-[2rem] w-full max-w-[420px] text-center relative z-10 shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-20 h-20 bg-gradient-to-tr from-primary to-blue-400 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 mb-8"
        >
          <span className="text-4xl text-white block">􀫊</span>
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-textMain">Sign In</h1>
        <p className="text-textMuted mb-8 text-sm font-medium">Use your MedFlow ID to continue.</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div className="space-y-1">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-textMain placeholder:text-textMuted focus:bg-black/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              required
            />
          </div>
          <div className="space-y-1">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-textMain placeholder:text-textMuted focus:bg-black/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              required
            />
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className="mt-6 w-full py-4 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              'Continue'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
