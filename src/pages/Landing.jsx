import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-textMain text-dark font-sans selection:bg-primary/30 overflow-hidden relative">
      {/* Navigation Bar */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary text-2xl">􀫊</span> MedFlow
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-full bg-dark text-textMain text-sm font-medium hover:bg-black transition-all active:scale-95"
        >
          Staff Portal
        </button>
      </nav>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="text-xs">􀋙</span> New: Advanced Patient Analytics
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 max-w-4xl">
          Healthcare management. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Perfected.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-textMuted max-w-2xl mb-12 font-medium leading-relaxed">
          High quality medical treatments, advanced technology, and a caring medical team — helping you achieve a healthy, confident life.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto">
          <button className="px-8 py-4 rounded-full bg-primary text-white text-lg font-semibold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-primary/30">
            Book Appointment
          </button>
          <button className="px-8 py-4 rounded-full bg-black/5 text-dark text-lg font-semibold hover:bg-black/10 transition-all active:scale-95">
            Learn More
          </button>
        </motion.div>

        {/* Services Section styled like features grid */}
        <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8 w-full text-left">
          {[
            { icon: "􀒡", title: "Advanced Diagnostics", desc: "Comfortable & safe comprehensive testing using state-of-the-art equipment." },
            { icon: "􀝾", title: "Free Consultation", desc: "Initial check-up & treatment planning included for all new patients." },
            { icon: "􀒓", title: "Preventive Care", desc: "Diagnostic exam + general health guidance to keep you healthy." }
          ].map((service, idx) => (
            <motion.div key={idx} variants={itemVariants} className="p-8 rounded-3xl bg-white shadow-xl shadow-black/5 border border-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-textMuted leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
