import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';

const COLORS = ['#0a84ff', '#30d158', '#ff9f0a', '#ff453a', '#bf5af2'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  
  if (!data) return <div className="p-8 text-danger bg-danger/10 rounded-2xl">Failed to load dashboard data. Please try again.</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Overview</h1>
        <p className="text-textMuted font-medium">Your pharmacy at a glance.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card title="Total Sales" value={`₹${data.totalSalesValue.toLocaleString()}`} icon="􀖗" />
        <Card title="Total Medicines" value={data.totalMedicines} icon="􀒓" />
        <Card title="Low Stock" value={data.lowStockCount} alert={data.lowStockCount > 0} icon="􀋙" />
        <Card title="Expiring Soon" value={data.expiringSoonCount} alert={data.expiringSoonCount > 0} icon="􀐫" />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl xl:col-span-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="text-primary">􀀁</span> Revenue Over Time
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0a84ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#86868b" tick={{fill: '#86868b', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#86868b" tick={{fill: '#86868b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(28,28,30,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#0a84ff', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="amount" stroke="#0a84ff" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span className="text-primary">􀀀</span> Stock by Category
          </h2>
          <div className="flex-1 flex flex-col justify-center min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryChartData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(28,28,30,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2">
              {data.categoryChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm font-medium text-textMuted">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
