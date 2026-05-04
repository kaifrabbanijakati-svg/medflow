import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Medicines() {
  const location = useLocation();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', expiryDate: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMedicines();
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    }
  }, [location]);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/medicines/${editingId}`, formData);
      } else {
        await api.post('/medicines', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', category: '', price: '', quantity: '', expiryDate: '' });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (med) => {
    setFormData({
      name: med.name,
      category: med.category,
      price: med.price,
      quantity: med.quantity,
      expiryDate: new Date(med.expiryDate).toISOString().split('T')[0]
    });
    setEditingId(med._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await api.delete(`/medicines/${id}`);
        fetchMedicines();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredMeds = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Inventory</h1>
          <p className="text-textMuted font-medium">Manage your pharmacy medicines and stock.</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', category: '', price: '', quantity: '', expiryDate: '' }); }}
          className="bg-primary hover:bg-blue-600 active:scale-95 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-primary/30 flex items-center gap-2 text-sm"
        >
          <span className="text-lg">􀅼</span> Add Medicine
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            className="glass-card p-6 rounded-3xl mb-6 shadow-sm border border-primary/20"
          >
            <h2 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2">
              <span className="text-primary">{editingId ? '􀈿' : '􀅼'}</span>
              {editingId ? 'Edit Medicine' : 'Add New Medicine'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted ml-1 uppercase tracking-wider">Name</label>
                <input required placeholder="e.g. Paracetamol" className="w-full p-3.5 rounded-xl bg-black/20 border border-white/5 text-textMain focus:bg-black/40 focus:border-primary/50 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted ml-1 uppercase tracking-wider">Category</label>
                <input required placeholder="e.g. Analgesic" className="w-full p-3.5 rounded-xl bg-black/20 border border-white/5 text-textMain focus:bg-black/40 focus:border-primary/50 outline-none transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted ml-1 uppercase tracking-wider">Price (₹)</label>
                <input required type="number" step="0.01" placeholder="0.00" className="w-full p-3.5 rounded-xl bg-black/20 border border-white/5 text-textMain focus:bg-black/40 focus:border-primary/50 outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted ml-1 uppercase tracking-wider">Quantity</label>
                <input required type="number" placeholder="0" className="w-full p-3.5 rounded-xl bg-black/20 border border-white/5 text-textMain focus:bg-black/40 focus:border-primary/50 outline-none transition-all" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-semibold text-textMuted ml-1 uppercase tracking-wider">Expiry Date</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input required type="date" className="flex-1 p-3.5 rounded-xl bg-black/20 border border-white/5 text-textMain focus:bg-black/40 focus:border-primary/50 outline-none transition-all color-scheme-dark" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                  <div className="flex gap-3 mt-4 sm:mt-0">
                    <button type="submit" className="px-6 py-3.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors active:scale-95 shadow-lg shadow-primary/20">Save</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-textMain rounded-xl font-semibold transition-colors active:scale-95">Cancel</button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-textMuted">
          􀊫
        </div>
        <input 
          type="text" 
          placeholder="Search by name or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl glass-card border-none text-textMain placeholder:text-textMuted focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex justify-center">
             <div className="w-8 h-8 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="p-5 text-xs font-semibold text-textMuted uppercase tracking-wider">Name</th>
                  <th className="p-5 text-xs font-semibold text-textMuted uppercase tracking-wider">Category</th>
                  <th className="p-5 text-xs font-semibold text-textMuted uppercase tracking-wider">Stock</th>
                  <th className="p-5 text-xs font-semibold text-textMuted uppercase tracking-wider">Price</th>
                  <th className="p-5 text-xs font-semibold text-textMuted uppercase tracking-wider">Expiry</th>
                  <th className="p-5 text-xs font-semibold text-textMuted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMeds.map((med, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={med._id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-5 font-semibold text-textMain">{med.name}</td>
                    <td className="p-5 text-sm text-textMuted font-medium">
                      <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">{med.category}</span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${med.quantity < 10 ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-success/10 text-success border border-success/20'}`}>
                        {med.quantity < 10 && <span className="text-[10px]">􀇾</span>}
                        {med.quantity} units
                      </span>
                    </td>
                    <td className="p-5 text-sm font-medium">₹{med.price.toFixed(2)}</td>
                    <td className="p-5 text-sm text-textMuted">{new Date(med.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="p-5 text-right space-x-2">
                      <button onClick={() => handleEdit(med)} className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                        􀈿
                      </button>
                      <button onClick={() => handleDelete(med._id)} className="p-2 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Delete">
                        􀈑
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredMeds.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-textMuted font-medium">No medicines found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
