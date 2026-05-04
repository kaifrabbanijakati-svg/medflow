import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Billing() {
  const [medicines, setMedicines] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/medicines');
      setMedicines(res.data.filter(m => m.quantity > 0)); // Only show in-stock
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleAddItem = (med) => {
    const existing = billItems.find(i => i.medicine === med._id);
    if (existing) {
      if (existing.quantity >= med.quantity) return; // Cannot exceed stock
      setBillItems(billItems.map(i => i.medicine === med._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setBillItems([...billItems, { medicine: med._id, name: med.name, price: med.price, quantity: 1, maxStock: med.quantity }]);
    }
  };

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter(i => i.medicine !== id));
  };

  const handleProcessPayment = async () => {
    if (billItems.length === 0) return;
    setProcessing(true);
    try {
      await api.post('/sales', { items: billItems, subtotal, tax, total });
      setBillItems([]);
      fetchMedicines(); // Refresh stock
      alert('Payment processed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Point of Sale</h1>
        <p className="text-textMuted font-medium">Process patient payments and generate invoices.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Pane - Inventory */}
        <motion.div variants={itemVariants} className="flex-1 w-full space-y-6">
          <div className="glass-card p-6 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary">􀐚</span> Select Items
            </h2>
            {loading ? (
              <div className="p-8 flex justify-center">
                 <div className="w-8 h-8 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto pr-2 pb-2">
                {medicines.map((med, idx) => (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={med._id}
                    onClick={() => handleAddItem(med)}
                    className="p-4 text-left bg-black/20 border border-white/5 hover:border-primary/50 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10 rounded-2xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textMuted group-hover:text-primary group-hover:bg-primary/10 mb-3 transition-colors">
                      􀒓
                    </div>
                    <div className="font-semibold text-sm mb-1 text-textMain line-clamp-1">{med.name}</div>
                    <div className="flex justify-between text-xs font-medium text-textMuted">
                      <span>₹{med.price.toFixed(2)}</span>
                      <span className="bg-white/10 px-1.5 rounded-md">{med.quantity} left</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl shadow-sm overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 bg-black/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-primary">􀎶</span> Cart Items
              </h2>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-black/20 text-xs font-semibold text-textMuted uppercase tracking-wider sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="p-4 pl-6">Item</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {billItems.map(item => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, backgroundColor: 'rgba(255,59,48,0.1)' }}
                        key={item.medicine} 
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 pl-6 font-semibold text-sm">{item.name}</td>
                        <td className="p-4 text-sm font-medium">
                          <span className="px-2.5 py-1 bg-white/10 rounded-lg">{item.quantity}</span>
                        </td>
                        <td className="p-4 text-sm font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => handleRemoveItem(item.medicine)} 
                            className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            􀁡
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {billItems.length === 0 && (
                    <tr><td colSpan="4" className="p-12 text-center text-textMuted font-medium">Cart is empty. Select items to begin.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Right Pane - Summary */}
        <motion.div variants={itemVariants} className="w-full lg:w-96 glass-card p-6 rounded-3xl shadow-xl border border-white/10 lg:sticky lg:top-6 flex flex-col min-h-[400px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-primary">􀍡</span> Checkout
          </h2>
          
          <div className="bg-black/20 p-5 rounded-2xl mb-6 flex-1">
            <div className="space-y-4 border-b border-white/10 pb-4">
              <div className="flex justify-between text-textMuted font-medium text-sm">
                <span>Subtotal ({billItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="text-textMain">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-textMuted font-medium text-sm">
                <span>Tax (5%)</span>
                <span className="text-textMain">₹{tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-4">
              <span className="text-sm font-semibold text-textMuted uppercase tracking-wider">Total</span>
              <span className="text-4xl font-bold text-textMain tracking-tight">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <motion.button 
            whileHover={billItems.length > 0 && !processing ? { scale: 1.02 } : {}}
            whileTap={billItems.length > 0 && !processing ? { scale: 0.98 } : {}}
            onClick={handleProcessPayment}
            disabled={billItems.length === 0 || processing}
            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 flex justify-center items-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></div>
            <span className="relative z-10 flex items-center gap-2">
              {processing ? (
                <><span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <>􀏀 Charge ₹{total.toFixed(2)}</>
              )}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
