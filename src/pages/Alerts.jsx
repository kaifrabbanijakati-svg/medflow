import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Alerts() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  
  if (!data) return <div className="p-8 text-danger bg-danger/10 rounded-2xl">Failed to load alerts.</div>;

  const alerts = [
    ...data.lowStockMedicines.map(m => ({
      id: `low_${m._id}`,
      type: 'critical',
      title: `Low Stock: ${m.name}`,
      message: `Current stock is ${m.quantity} units. Please reorder immediately.`,
      actionTarget: '/medicines',
      searchParam: m.name,
      time: 'Just now'
    })),
    ...data.expiringSoonMedicines.map(m => ({
      id: `exp_${m._id}`,
      type: 'warning',
      title: `Expiring Soon: ${m.name}`,
      message: `Expires on ${new Date(m.expiryDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}. Please clear stock.`,
      actionTarget: '/medicines',
      searchParam: m.name,
      time: 'Today'
    }))
  ];

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return <div className="w-10 h-10 rounded-full bg-danger/20 text-danger flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(255,59,48,0.2)]">􀇿</div>;
      case 'warning': return <div className="w-10 h-10 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(255,149,0,0.2)]">􀇾</div>;
      default: return <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(10,132,255,0.2)]">􀅼</div>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Notifications</h1>
          <p className="text-textMuted font-medium">System alerts for stock and expiry.</p>
        </div>
        <div className="bg-white/5 px-4 py-1.5 rounded-full text-sm font-medium border border-white/5">
          {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
        </div>
      </motion.div>
      
      {alerts.length === 0 ? (
        <motion.div variants={itemVariants} className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center border border-white/5">
          <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center text-4xl mb-6 shadow-[inset_0_0_20px_rgba(52,199,89,0.2)]">
            􀁣
          </div>
          <h2 className="text-xl font-bold mb-2">You're all caught up!</h2>
          <p className="text-textMuted font-medium">No low stock or expiring medicines at the moment.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.99 }}
                key={alert.id} 
                className={`glass-card p-5 rounded-2xl flex gap-5 items-start cursor-pointer transition-all border ${alert.type === 'critical' ? 'border-danger/20 hover:border-danger/40' : 'border-warning/20 hover:border-warning/40'}`}
                onClick={() => navigate(alert.actionTarget, { state: { searchTerm: alert.searchParam } })}
              >
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-textMain tracking-tight">{alert.title}</h3>
                    <span className="text-xs font-medium text-textMuted">{alert.time}</span>
                  </div>
                  <p className="text-textMuted text-sm leading-relaxed">{alert.message}</p>
                </div>
                <div className="text-textMuted self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  􀰑
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
