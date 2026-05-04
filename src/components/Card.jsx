import { motion } from 'framer-motion';

export default function Card({ title, value, alert, icon }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl p-6 ${alert ? 'bg-danger/10 border border-danger/30' : 'glass-card'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-sm font-medium ${alert ? 'text-danger' : 'text-textMuted'}`}>
          {title}
        </h3>
        {icon && (
          <div className={`p-2 rounded-xl ${alert ? 'bg-danger/20 text-danger' : 'bg-white/5 text-primary'}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between mt-4">
        <div className={`text-3xl font-bold tracking-tight ${alert ? 'text-danger' : 'text-textMain'}`}>
          {value}
        </div>
        
        {alert && (
          <span className="inline-flex items-center rounded-full bg-danger/20 px-2.5 py-0.5 text-xs font-semibold text-danger">
            Action Needed
          </span>
        )}
      </div>
    </motion.div>
  );
}
